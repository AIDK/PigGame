'use strict';

// player main objects
const objPlayerOne = document.querySelector('.player--0');
const objPlayerTwo = document.querySelector('.player--1');

// player score object
const objPlayerOneScore = document.getElementById('score--0');
const objPlayerTwoScore = document.getElementById('score--1');

// player current score objects
const objPlayerOneCurrentScore = document.getElementById('current--0');
const objPlayerTwoCurrentScore = document.getElementById('current--1');

// dice object
const objDice = document.querySelector('.dice');

// buttons
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

// reset the 'text context' of the HTMLElement
const resetPlayerObjects = function (htmlElement) {
	htmlElement.textContent = 0;
};

// remove the 'CSS class' from the HTMLElement
const removeClass = function (htmlElement, classObject) {
	htmlElement.classList.remove(classObject);
};

const addClass = function (htmlElement, classObject) {
	htmlElement.classList.add(classObject);
};

const toggleActivePlayer = function (htmlElement) {
	htmlElement.classList.toggle('player--active');
};

let gameScore, currentPlayerScore, playerIndex, isGameOver;

// setup initial load
const init = function () {
	// init state variables
	gameScore = [0, 0];
	currentPlayerScore = 0;
	playerIndex = 0;
	isGameOver = false;

	// reset all game and player scores
	resetPlayerObjects(objPlayerOneScore);
	resetPlayerObjects(objPlayerTwoScore);
	resetPlayerObjects(objPlayerOneCurrentScore);
	resetPlayerObjects(objPlayerTwoCurrentScore);

	// reset all game and player states
	removeClass(objPlayerOne, 'player--winner');
	removeClass(objPlayerTwo, 'player--winner');
	removeClass(objPlayerTwo, 'player--active');

	addClass(objDice, 'hidden');
	addClass(objPlayerOne, 'player--active');
};

// load
init();

// switching of current active player
const switchPlayer = function () {
	// reset the previous player's score back to 0 (zero)
	// i.e. previous player is current active player because
	// we haven't executed the actual switching of players yet
	// document.getElementById(`current--${playerIndex}`).textContent = 0;
	resetPlayerObjects(playerIndex === 0 ? objPlayerOneCurrentScore : objPlayerTwoCurrentScore);

	// determines the next player (i.e. Player 1 or 2)
	// now the active switching of the player occurrs
	playerIndex = playerIndex === 0 ? 1 : 0;

	// when switching players the new player's current score should be reset
	currentPlayerScore = 0;

	// toggles the 'active player' class,
	// i.e. will add the 'active player' class to player 1 if player 2 was the
	// active player and visa versa
	toggleActivePlayer(objPlayerOne);
	toggleActivePlayer(objPlayerTwo);
};

// rolling the dice
btnRoll.addEventListener('click', function () {
	// we don't want any of this functionality to happen when
	// the game is over so we have to check the game state first
	if (!isGameOver) {
		// roll the dice (random number between 1 and 6)
		const diceValue = Math.trunc(Math.random() * 6) + 1;

		// set the dice image based on the rolled value
		objDice.src = `/assets/dice-${diceValue}.png`;

		// show the dice to the player by removing the 'hidden' class
		// tag from the image object
		removeClass(objDice, 'hidden');

		// the game must swap players when either player rolls one (1),
		if (diceValue === 1) {
			// we have to check for it and swap to the
			// next player when one (1) is rolled
			switchPlayer();
		} else {
			// while the player is 'rolling' the dice we have to
			// keep track of all the points they have accumulated
			// as this will become their overall points in the game
			currentPlayerScore += diceValue;

			// display the players points to them
			document.getElementById(`current--${playerIndex}`).textContent = currentPlayerScore;
		}
	}
});

// holding/banking player score
btnHold.addEventListener('click', function () {
	// we don't want any of this functionality to happen when
	// the game is over so we have to check the game state first
	if (!isGameOver) {
		// we have to keep track of each players score during the game
		// so when a player decides to hold/bank their points we set their
		// score to the gamescore variable
		gameScore[playerIndex] += currentPlayerScore;

		// display the current player's accumulated points
		document.getElementById(`score--${playerIndex}`).textContent = gameScore[playerIndex];

		// game over is reached when a player reaches a total score higher or equal than 100,
		// so we check the current player score and set the game over state if they are over
		if (gameScore[playerIndex] < 100) {
			// when a player decides to hold/bank their points
			// and the game is not over yet, they automatically give up their turn
			// so we swap to the next player
			switchPlayer();
		} else {
			// the total maximum points have been reached and the game is over,
			// we set the 'isGameOver' to FALSE to prevent players from continuing play
			isGameOver = true;

			// indicate to the players who the winner is
			const playerObject = playerIndex === 0 ? objPlayerOne : objPlayerTwo;
			addClass(playerObject, 'player--winner');
			removeClass(playerObject, 'player--active');

			// the game is over so we have no need to display the dice image anymore
			addClass(objDice, 'hidden');
		}
	}
});

// reset game on 'new'
btnNew.addEventListener('click', init);
