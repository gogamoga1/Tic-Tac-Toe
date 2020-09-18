const container = document.querySelector(".grid-container");
const newBtn = document.querySelectorAll("button");
const form = document.querySelector("form");
let turn = 1;
let firstPlayer = "X";
let secondPlayer = "O";
var guy, gal;

const gameboard = (() => {
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const getBoard = () => board;
  const setMark = (idx, player) => (board[idx] = player);
  const resetBoard = () => (board = [0, 1, 2, 3, 4, 5, 6, 7, 8]);

  return {
    getBoard,
    setMark,
    resetBoard,
  };
})();

const Player = (name) => {
  return {
    name,
  };
};

const display = (() => {
  const render = () => {
    container.style.visibility = "visible";
    form.style.visibility = "hidden";
    newBtn[0].style.visibility = "visible";
    gameboard.getBoard().forEach((item, index) => {
      const newDiv = createElement("div", "grid-item", index, "");
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
  return {
    render,
    createElement,
    getElement,
    resetDisplay,
  };
})();

const Controller = () => {
  let gameState = 0;
  let numPlayers = 1;
  return {
    gameState,
    numPlayers,
  };
};

const AI = (() => {
  const makeMove = () => {
    if (Controller.gameState) return;
    let randomNumber = minimax(gameboard.getBoard(), "O").index;
    return randomNumber;
  };
  return {
    makeMove,
  };
})();

function checkWinner(board, player) {
  let winComb = [
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  return winComb.some((combination) => {
    return combination.every((index) => {
      return board[index] === player;
    });
  });
}

container.addEventListener("click", (e) => {
  if (e.target.className === "grid-container") return;
  if (!isNaN(e.target.textContent) && !Controller.gameState) {
    if (Controller.numPlayers === 2) {
      if (turn === 1) {
        markSpot(e.target.id, firstPlayer);
        turn = 2;
      } else if (turn === 2) {
        markSpot(e.target.id, secondPlayer);
        turn = 1;
      }
    } else {
      markSpot(e.target.id, firstPlayer);
      if (!Controller.gameState) markSpot(AI.makeMove(), secondPlayer);
    }
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  guy = Player(fname.value);
  gal = Player(lname.value);
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

function emptyIndexies(board) {
  return board.filter((item) => item !== "O" && item !== "X");
}

function minimax(newBoard, player) {
  let freeSpots = emptyIndexies(newBoard);
  if (checkWinner(newBoard, player))
    return {
      score: player === "X" ? -10 : 10,
    };
  else if (freeSpots.length === 0)
    return {
      score: 0,
    };

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
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function markSpot(id, player) {
  document.querySelector(`#\\3${id}`).textContent = player;
  gameboard.setMark(id, player);

  if (checkWinner(gameboard.getBoard(), player)) {
    alert(
      `${
        Controller.numPlayers === 1 && player === "O"
          ? "AI"
          : player === "X"
          ? guy.name
          : gal.name
      } won`
    );
    Controller.gameState = 1;
    return;
  }

  if (gameboard.getBoard().every((item) => typeof item !== "number")) {
    alert("It's a tie");
    Controller.gameState = 1;
  }
}
