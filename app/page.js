"use client";

import "./page.css";
import React, { useState } from "react";

function Square({ data, onSquareClick, styleClass }) {
  return (
    <button className={styleClass} onClick={onSquareClick}>
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
      return [a, b, c];
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
    console.log(Math.floor(i / 3), i % 3);
    const nextSquares = squares.slice();
    nextSquares[i] = xTurn ? "X" : "O";
    onPlay(nextSquares);
  }

  const board = [];
  for (let row = 0; row < 3; row++) {
    const boardRow = [];
    for (let square = 0; square < 3; square++) {
      const index = row * 3 + square;
      boardRow.push(
        <Square
          key={index}
          data={squares[index]}
          onSquareClick={() => handleClick(index)}
          styleClass={
            winner != null && winner.includes(index)
              ? "winning-square"
              : "square"
          }
        />
      );
    }
    board.push(
      <div className="board-row" key={row}>
        {boardRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">
        {winner
          ? winner === "Draw"
            ? "Draw"
            : "Winner: " + squares[winner[0]]
          : "Next player: " + (xTurn ? "X" : "O")}
      </div>
      {board}
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
  const [descending, setDescending] = useState(false);

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
        <button
          onClick={() => {
            setCurrentMove(initialState.currentMove);
            setHistory(initialState.history);
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            setDescending(!descending);
          }}
        >
          Sort move list
        </button>
      </div>
      <div className="game-info">
        <ol>{descending ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}
