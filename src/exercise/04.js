// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useState} from "react";
import {useLocalStorageState} from '../utils'
function Board({squares, onClick }) {


    function renderSquare(i) {
        return (
            <button className="square" onClick={() => onClick(i)}>
                {squares[i]}
            </button>
        )
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    )
}

function Game() {

    const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)]);
    const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0);

    function setSquares(squares){
        // current step 0
        // history[0] = [null....]
        if(currentStep === history.length-1) {
            // make a new step
            setHistory([...history, squares]);
            setCurrentStep((currentStep) => currentStep + 1);
        }else{
            debugger
            // change history
            const newHistory = history;
            newHistory.length = currentStep+1;
            newHistory.push(squares);
            setHistory(newHistory);
            setCurrentStep((currentStep) => currentStep + 1);
        }
    }

    const squares = history[currentStep];
    const nextValue = calculateNextValue(squares);
    const winner = calculateWinner(squares);
    const status = calculateStatus(winner, squares, nextValue);
    let moves = []
    moves = calculateMoves();

    function calculateMoves() {

        const res = [];

        history.forEach((e, idx) => {
            switch(idx) {
                case 0:
                    res.push(<li><button disabled={currentStep === idx} onClick={()=>setCurrentStep(idx)}>Go to game start {currentStep === idx? '(current)' : ''}</button></li>)
                    break;
                default:
                    res.push(<li><button disabled={currentStep === idx} onClick={()=>setCurrentStep(idx)}>Go to move #{idx} {currentStep === idx? '(current)' : ''}</button></li>)
                    break;
            }
        })

        return res;
    }
    function restart() {

        setCurrentStep(0);
        setHistory([Array(9).fill(null)]);
    }
    function selectSquare(square) {

        if(winner || squares[square]) {
            return false
        }else {

            const newSquares = [...squares];
            newSquares[square] = nextValue;
            setSquares(newSquares);
        }
    }
    return (
        <div className="game">
            <div className="game-board">
                <Board onClick={selectSquare} squares={squares} />
                <button className="restart" onClick={restart}>
                    restart
                </button>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>

    )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
    return winner
        ? `Winner: ${winner}`
        : squares.every(Boolean)
            ? `Scratch: Cat's game`
            : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

function App() {
    return <Game />
}

export default App
