var origBoard; // Gonna be an array that will track the input (x, o, nothing)
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.cell');
//  ^ store variable will store a to each cell classes
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none"; // modifying css to set display: none for the replay
    origBoard = Array.from(Array(9).keys()); // make array to be the number from 0 - 9
    // resets the board
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

/**
 * square.target.id = returns the id of the sqaure, that the human player clicked
 * calls the turn function for when the player clicks on his turn
 * 
 */
function turnClick(square) {

    if (typeof origBoard[square.target.id] == 'number') { // prevents you from clicking on a tile that has already been clicked
        turn(square.target.id, huPlayer);
        //bestSpot() returns the id the id that has been clicked by the ai
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}


function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player; // updates the board and shows where the player has clicked

    //checks every turn if a player has won
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    /**
     * find all places on the board, where the players have clicked already
     * reduce  goes through all elements of boards, gives back one value
     * the accumulator a, is the element that is given back to is saved in an array
     * e is the element of board array that we are going through
     * i is index
     */
    let gameWon = null;

    // check if the game has been won
    for (let [index, win] of winCombos.entries()) {
        /**
         * loops through winCombos
         * winCombos.entries returns the index and the winCombo
         */
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            /**
             * win.every: for every element of win
             * plays.indexOf(elem) > -1 : has the player played in every spot for a win in a win
             */
            gameWon = { index: index, player: player };
            break;
        };
    }
    return gameWon;
}

function gameOver(gameWon) {
    /**
     * highlight all the fields of the winning combination
     */
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "green" : "red";
    }
    /**
     * removes the eventListener, so that the player cannot click on the board anymore
     */
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}


function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
    /**
     * filters every element of the origBoard
     * if its a number and not x or o, its empty
     */
}

function bestSpot() {

    // // Basic Ai
    // return emptySquares()[0];
    // // Ai will play on the first empty Square it detects

    return minimax(origBoard, aiPlayer).index; // 40:37
}

function checkTie() {
    if (emptySquares().length == 0) { // checks every square is filled up
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 20 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];

}