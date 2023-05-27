"use client";

import "./page.css";
import React, { useState } from "react";

function Square({ data, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {data}
    </button>
  );
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line = 0; line < lines.length; line++) {
    const [a, b, c] = lines[line];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  let draw = true;
  for (let box = 0; box < board.length; box++) {
    if (!board[box]) {
      draw = false;
      break;
    }
  }
  return draw ? "Draw" : null;
}

function Board({ xTurn, squares, onPlay }) {
  const winner = calculateWinner(squares);
  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xTurn ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">
        {winner
          ? winner === "Draw"
            ? "Draw"
            : "Winner: " + winner
          : "Next player: " + (xTurn ? "X" : "O")}
      </div>
      <div className="board-row">
        <Square data={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square data={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square data={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square data={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square data={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square data={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square data={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square data={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square data={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function App() {
  const initialState = {
    currentMove: 0,
    history: [Array(9).fill(null)],
  };
  const [currentMove, setCurrentMove] = useState(initialState.currentMove);
  const [history, setHistory] = useState(initialState.history);
  const xTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpToMove(move) {
    setCurrentMove(move);
  }

  const moves = history.map((history, move) => {
    return (
      <li key={move}>
        {move == currentMove ? (
          <p>{move ? "You are at move #" + move : "Game Start"}</p>
        ) : (
          <button onClick={() => jumpToMove(move)}>
            {move ? "Go to move #" + move : "Go to game start"}
          </button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xTurn={xTurn} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="game-info">
        <button
          onClick={() => {
            setCurrentMove(initialState.currentMove);
            setHistory(initialState.history);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
