const container = document.querySelector(".grid-container");
const newBtn = document.querySelector("#newgame");

const gameboard = ((string) => {
  let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  const getBoard = () => board;
  const setMark = (idx) => (board[idx] = "X");
  const setMarkAI = (idx) => (board[idx] = "O");
  const resetBoard = () => board.fill(" ");

  return { getBoard, setMark, setMarkAI, resetBoard };
})();

const Player = (name) => {
  const getName = () => name;
  return {getName}
};

const display = (() => {
  const render = () => {
    gameboard.getBoard().forEach((item, index) => {
      const newDiv = createElement("div", "grid-item", index, item);
      container.appendChild(newDiv);
    });
  };
  const createElement = (tag, className, id, text) => {
    const element = document.createElement(tag);
    element.id = id;
    element.textContent = text;
    if (className) element.classList.add(className);

    return element;
  };
  const getElement = (selector) => {
    const element = document.querySelector(selector);

    return element;
  };
  const resetDisplay = () => {
    while (container.firstChild) container.removeChild(container.lastChild);
    render();
  };
  return { render, createElement, getElement, resetDisplay };
})();

const Controller = () => {
  let gameState = 0;
  return gameState;
};

container.addEventListener("click", (e) => {
  if (e.target.className === "grid-container") return;
  if (e.target.textContent == " " && !Controller.gameState) {
    e.target.textContent = "X";
    gameboard.setMark(e.target.id);
    checkWinner(gameboard.getBoard());
    AI.makeMove();
    
  }
});

newBtn.addEventListener("click", (e) => {
  gameboard.resetBoard();
  display.resetDisplay();
  Controller.gameState = 0;
});

const TicTacToe = (() => {
  let gameState = 0;
  if (!gameState) display.render();
  const newPlayer = Player(prompt("Please enter your name"))
  return {newPlayer}
})();

const AI = ((e) => {
  const makeMove = () => {
    if (Controller.gameState) return;
    let randomNumber = Math.floor(Math.random() * 10);
    if (gameboard.getBoard()[randomNumber] === " ") {
      gameboard.setMarkAI(randomNumber);
      document.querySelector(`#\\3${randomNumber}`).textContent = "O";
      return;
    } else {
      if (gameboard.getBoard().indexOf(" ") == -1) return;
      AI.makeMove();
    }
  };
  return { makeMove };
})();

function checkWinner(board) {
  if (Controller.gameState) return;
  let winningChar = (a, b, c) => {
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== " ") {
      board[a] === "X" ? alert(`${TicTacToe.newPlayer.getName()} won!`) : alert("AI won");
      Controller.gameState = 1;
      return true;
    }
    return false;
  };
  if (winningChar(0, 4, 8)) return;
  if (winningChar(2, 4, 6)) return;
  if (winningChar(0, 1, 2)) return;
  if (winningChar(3, 4, 5)) return;
  if (winningChar(6, 7, 8)) return;
  if (winningChar(0, 3, 6)) return;
  if (winningChar(1, 4, 7)) return;
  if (winningChar(2, 5, 8)) return;

  if (gameboard.getBoard().indexOf(" ") == -1) {
    alert("It's a tie");
    return;
  }
}
