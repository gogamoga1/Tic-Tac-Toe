const container = document.querySelector(".grid-container");
const newBtn = document.querySelectorAll("button");
const form = document.querySelector("form");
let turn = 1;

const gameboard = (() => {
  let board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  const getBoard = () => board;
  const setMark = (idx) => (board[idx] = "X");
  const setMarkAI = (idx) => (board[idx] = "O");
  const resetBoard = () => board.fill(" ");

  return { getBoard, setMark, setMarkAI, resetBoard };
})();

const Player = (name) => {
  const getName = () => name;
  return { name, getName };
};

const display = (() => {
  const render = () => {
    container.style.visibility = "visible";
    form.style.visibility = "hidden";
    newBtn[0].style.visibility = "visible";
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
  let numPlayers = 1;
  return { gameState, numPlayers };
};



const AI = (() => {
  const makeMove = () => {
    if (Controller.gameState) return;
    let randomNumber = Math.floor(Math.random() * 10);
    if (gameboard.getBoard()[randomNumber] === " ") {
      gameboard.setMarkAI(randomNumber);
      document.querySelector(`#\\3${randomNumber}`).textContent = "O";
      checkWinner(gameboard.getBoard());
      return;
    } else {
      if (gameboard.getBoard().indexOf(" ") === -1) return;
      AI.makeMove();
    }
  };
  return { makeMove };
})();

function checkWinner(board) {
  if (Controller.gameState) return;
  let winningChar = (a, b, c) => {
    if (board[a] === board[b] && board[b] === board[c] && board[a] !== " ") {
      board[a] === "X"
      ? alert(`${playerOne.name} won!`)
      : alert(`${Controller.numPlayers === 2 ? playerTwo.name : "AI"} won`);
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
  
  if (gameboard.getBoard().indexOf(" ") === -1) alert("It's a tie");
}

container.addEventListener("click", (e) => {
  if (e.target.className === "grid-container") return;
  if (e.target.textContent === " " && !Controller.gameState) {
    if (Controller.numPlayers === 2) {
      if (turn === 1) {
        e.target.textContent = "X";
        turn = 2;
        gameboard.setMark(e.target.id);
      } else if (turn === 2) {
        e.target.textContent = "O";
        turn = 1;
        gameboard.setMarkAI(e.target.id);
      }

      checkWinner(gameboard.getBoard());
    } else {
      e.target.textContent = "X";
      gameboard.setMark(e.target.id);
      checkWinner(gameboard.getBoard());
      AI.makeMove();
    }
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  playerOne = Player(fname.value);
  playerTwo = Player(lname.value);
  gameboard.resetBoard();
  display.resetDisplay();
});
newBtn.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (e.target.id === "newgame") {
      gameboard.resetBoard();
      display.resetDisplay();
      Controller.gameState = 0;
    }
    if (e.target.id === "1pl") {
      newBtn[1].style.visibility = "hidden";
      newBtn[2].style.visibility = "hidden";
      form.style.visibility = "visible";
      lname.style.visibility = "hidden";
      lname.previousElementSibling.previousElementSibling.style.visibility =
      "hidden";
      lname.required = false;
      
    }
    if (e.target.id === "2pl") {
      newBtn[1].style.visibility = "hidden";
      newBtn[2].style.visibility = "hidden";
      form.style.visibility = "visible";
      
      Controller.numPlayers = 2;
    }
  });
});

var playerOne, playerTwo;
