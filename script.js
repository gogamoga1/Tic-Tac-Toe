const container = document.querySelector(".grid-container");
const newBtn = document.querySelectorAll("button");
const form = document.querySelector("form");
let turn = 1;

const gameboard = (() => {
  let board = [0,1 ,2,3,4 ,5, 6 ,7,8];

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
    let randomNumber = minimax(gameboard.getBoard(), "O").index;
    if (!isNaN(gameboard.getBoard()[randomNumber])) {
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
  let winner = "";
  if (Controller.gameState) return;
  let winningChar = (a, b, c) => {
    if (board[a] === board[b] && board[b] === board[c] && isNaN(board[a])) {
      board[a] === "X"
        ? (alert(`${playerOne.name} won!`), (winner = "X"))
        : (alert(`${Controller.numPlayers === 2 ? playerTwo.name : "AI"} won`),
          (winner = "O"));
      Controller.gameState = 1;
      return true;
    }
    return false;
  };
  if (winningChar(0, 4, 8)) return winner;
  if (winningChar(2, 4, 6)) return winner;
  if (winningChar(0, 1, 2)) return winner;
  if (winningChar(3, 4, 5)) return winner;
  if (winningChar(6, 7, 8)) return winner;
  if (winningChar(0, 3, 6)) return winner;
  if (winningChar(1, 4, 7)) return winner;
  if (winningChar(2, 5, 8)) return winner;

  //if (gameboard.getBoard().indexOf(" ") === -1) alert("It's a tie");
}

container.addEventListener("click", (e) => {
  if (e.target.className === "grid-container") return;
  if (!isNaN(e.target.textContent) && !Controller.gameState) {
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

function emptyIndexies(board) {
  let empty = [];
  board.forEach((item, idx) => {
    if (item != "O" && item != "X") {
      empty.push(idx);
    }
  });
  return empty;
}

function minimax(newBoard, player) {
  let freeSpots = emptyIndexies(newBoard);

  if (checkWinner1337(newBoard) === "X") return { score: -10 };
  else if (checkWinner1337(newBoard) === "O") return { score: 10 };
  else if (freeSpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i = 0; i < freeSpots.length; i++) {
    let move = {};
    move.index = freeSpots[i];
    newBoard[freeSpots[i]] = player;

    if (player === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }
    newBoard[freeSpots[i]] = move.index;
    moves.push(move);
    
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -10000;
    for (let i = 0 ; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  else {
    let bestScore = 10000;
    for (let i = 0 ; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
  }
}
return moves[bestMove];
}


function checkWinner1337(board) {
  let winner = "";
  if (Controller.gameState) return;
  let winningChar = (a, b, c) => {
    if (board[a] === board[b] && board[b] === board[c] && isNaN(board[a]) ) {
      board[a] === "X"
        ? winner = "X"
        : winner = "O"
      return true;
    }
    return false;
  };
  if (winningChar(0, 4, 8)) return winner;
  if (winningChar(2, 4, 6)) return winner;
  if (winningChar(0, 1, 2)) return winner;
  if (winningChar(3, 4, 5)) return winner;
  if (winningChar(6, 7, 8)) return winner;
  if (winningChar(0, 3, 6)) return winner;
  if (winningChar(1, 4, 7)) return winner;
  if (winningChar(2, 5, 8)) return winner;

}