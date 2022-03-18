// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import {PokemonForm} from '../pokemon'
import {useEffect, useState} from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null };

    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {  error };

    }
    render() {
        const {error} = this.state
        if (error) {
            return <this.props.fallbackComp error={error} />
        }

        return this.props.children
    }
}

function fallbackComponent({error}) {
    return (<div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>)
}
function PokemonInfo({pokemonName}) {

    const STATUS = {
        IDLE: 'idle',
        PENDING: 'pending',
        RESOLVED: 'resolved',
        REJECTED: 'rejected',
    }
    const [state, setState] = useState({status: STATUS.IDLE, pokemonData: null, error: null});

    useEffect(() => {

        if(!pokemonName) {
            return false;
        }
        setState({...state, status:STATUS.PENDING});
        (async () => {
            try{
                const data = await fetchPokemon(pokemonName);
                setState({...state,status:STATUS.RESOLVED, pokemonData:data})
            }catch (e) {
                setState({...state, status:STATUS.REJECTED, error:e})

            }
        })()
    }, [pokemonName])

    switch (state.status){
        case STATUS.IDLE:
            return 'Submit a pokemon';
        case STATUS.PENDING:
            return <PokemonInfoFallback name={pokemonName} />
        case STATUS.REJECTED:
            throw state.error
        case STATUS.RESOLVED:
            return <PokemonDataView pokemon={state.pokemonData} />

    }
}

function App() {
    const [pokemonName, setPokemonName] = React.useState('')

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName)
    }

    return (
        <div className="pokemon-info-app">
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
            <hr />
            <div className="pokemon-info">
                <ErrorBoundary fallbackComp = {fallbackComponent}>
                    <PokemonInfo pokemonName={pokemonName} />
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default App
