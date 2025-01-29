import React, { useState } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : "Draw";
  };

  const handleClick = (index) => {
    if (board[index] || checkWinner(board)) return;
  
    const newBoard = [...board];
    if(mode==="ai"){
    newBoard[index] = "X";
    } else{
      if(isXNext){
        newBoard[index]="X"
      }else{
        newBoard[index]="O"
      }
    }
    setBoard(newBoard);
  
    if (checkWinner(newBoard)) return;
  
    setIsXNext(false);  
  
    if (mode === "ai") {
      setTimeout(() => {
        aiMove(newBoard);
      }, 500);
    }
    else{
      setIsXNext(!isXNext);
    }
  };
  

  const aiMove = (currentBoard) => {
    let bestScore = -Infinity;
    let move;
  
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        currentBoard[i] = "O";  
        let score = minimax(currentBoard, 0, false);  
        currentBoard[i] = null;
  
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
  
    if (move !== undefined) {
      currentBoard[move] = "O";  
      setBoard([...currentBoard]);
      setIsXNext(true);  
    }
  };
  

  const minimax = (board, depth, isMaximizing) => {
    let result = checkWinner(board);
    if (result === "X") return -10;
    if (result === "O") return 10;
    if (result === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game-container">
      <h1>Tic Tac Toe</h1>
      {mode === null ? (
        <div className="mode-selection">
          <button onClick={() => setMode("pvp")}>Player vs Player</button>
          <button onClick={() => setMode("ai")}>You vs AI</button>
        </div>
      ) : (
        <>
          <div className="board">
            {board.map((cell, index) => (
              <div
                key={index}
                className="cell"
                onClick={() => handleClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
          <p>{checkWinner(board) ? `Winner: ${checkWinner(board)}` : `Next Player: ${isXNext ? "X" : "O"}`}</p>
          <button onClick={resetGame}>Reset</button>
        </>
      )}
    </div>
  );
};

export default TicTacToe;
