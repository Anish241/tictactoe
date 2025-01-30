import React, { useState } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState(null);
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState(null);

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
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setHistory([...history, { player: isXNext ? "X" : "O", position: index }]);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    setIsXNext(!isXNext);

    if (mode === "ai" && !winner) {
      setTimeout(() => aiMove(newBoard), 500);
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
      setHistory([...history, { player: "O", position: move }]);
      const gameWinner = checkWinner(currentBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      } else {
        setIsXNext(true);
      }
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
    setHistory([]);
    setWinner(null);
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
              <div key={index} className="cell" onClick={() => handleClick(index)}>
                {cell}
              </div>
            ))}
          </div>
          <p>Next Player: {isXNext ? "X" : "O"}</p>
          <button onClick={resetGame}>Reset</button>

          {winner && (
            <div className="winner-dialog">
              <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>
              <button onClick={resetGame}>Play Again</button>
            </div>
          )}

          <div className="history">
            <h3>Move History:</h3>
            <ul>
              {history.map((move, index) => (
                <li key={index}>{`Player ${move.player} moved to position ${move.position}`}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default TicTacToe;
