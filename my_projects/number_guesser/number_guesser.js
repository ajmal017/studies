window.addEventListener('DOMContentLoaded', addEventListeners);
let min = 1,
    max = 100,
    winningNum = Math.floor(Math.random() * max) + min,
    guessesLeft = 6,
    totalGuesses = 6,
    yourGuesses = [],
    recordContent = 'Your Guesses: ';

const minNum = document.querySelector('.min-num'),
    maxNum = document.querySelector('.max-num'),
    guessForm = document.getElementById('guess-form'),
    guessInput = document.getElementById('input-guess'),
    showPreviousGuesses = document.getElementById('div-guesses-record'),
    showResultDiv = document.getElementById('div-result'),
    remainingGuesses = document.getElementById('div-remaining-guesses'),
    guessBtn = document.getElementById('btn-guess');

minNum.textContent = min;
maxNum.textContent = max;

guessInput.setAttribute('min', min);
guessInput.setAttribute('max', max);


function addEventListeners() {
    showLeftGuesses();
    guessForm.addEventListener('submit', compareNumInput);
}

function compareNumInput(e) {
    if (e.target.childNodes[3].textContent === 'GUESS') {
        guessValue = guessInput.value;
        yourGuesses.push(guessValue);
        --guessesLeft;
        showLeftGuesses();
        let didWin = false;

        if (guessValue == winningNum) {
            didWin = winGame();
            showGuessRecords(totalGuesses, didWin);
        } else if (guessesLeft === 0) {
            showGuessRecords(totalGuesses, didWin);
            loseGame();
        } else {
            tryAgain(guessValue);
            showGuessRecords(totalGuesses, didWin);
        }
        e.preventDefault();
    } else {
        resetGame();
    }
}

function showGuessRecords(totalGuesses, didWin) {
    recordContent += yourGuesses[yourGuesses.length - 1];
    if (yourGuesses.length < totalGuesses && didWin === false) {
        recordContent += ', ';
    }
    showPreviousGuesses.textContent = recordContent;
}

function showLeftGuesses() {
    remainingGuesses.textContent = 'Guesses Left: ' + guessesLeft;
}

function winGame() {
    showResultDiv.textContent = 'Congratulations! You win!';
    showResultDiv.style.color = '#155724';
    showResultDiv.style.backgroundColor = '#d4edda';
    showResultDiv.style.borderColor = '#c3e6cb';
    guessInput.disabled = true;
    guessBtn.textContent = 'RESTART';
    return true;
}

function tryAgain(guessVal) {
    guessInput.value = '';
    if (guessVal > winningNum) {
        showResultDiv.textContent = 'Try Again! The number is smaller.';

    } else if (guessVal < winningNum) {
        showResultDiv.textContent = 'Try Again! The number is greater.';
    }
    showResultDiv.style.color = '#721c24';
    showResultDiv.style.backgroundColor = '#f8d7da';
    showResultDiv.style.borderColor = '#f5c6cb';
}

function loseGame() {
    showResultDiv.textContent = 'You Lose! The Number is ' + winningNum;
    guessInput.disabled = true;
    guessBtn.textContent = 'RESTART';
}

function resetGame() {
    guessesLeft = totalGuesses;
    guessInput.disabled = false;
    guessBtn.textContent = 'GUESS';
    guessInput.value = '';
    showResultDiv.textContent = '';
    showPreviousGuesses.textContent = '';
    recordContent = 'Your Guesses: ';
    remainingGuesses.textContent = 'Guesses Left: 5';
    yourGuesses = [];
    winningNum = Math.floor(Math.random() * max) + min;
}