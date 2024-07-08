document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    createKeyboard();
    gameSetup();
})

const words = ["venom", "trail", "money", "snake", "apple", "flake",
    "place", "range", "event", "conch", "knead", "obese",
    "zesty", "never", "yearn", "resin", "write", "lover",
    "quail", "flood","bagel", "jelly", "grant", "under",
    "ivory", "angle", "defer", "hazel", "xenon", "crown"
]

let word = words[Math.floor(Math.random()* words.length)];
console.log(`The answer is: ${word}`);
let attempts = 0;

function gameSetup() {
    const submitBtn = document.getElementById("submit-btn");
    const guessInput = document.getElementById("guess");

    submitBtn.addEventListener("click", async () => {
        const guess = guessInput.value.toLowerCase();
        if (guess.length !== 5) {
          alert("Please enter a 5-letter word");
          return;
        } 

        const isValidWord = await validateWord(guess);
        if (!isValidWord) {
            alert("The word is not in the dictionary. Please enter a valid 5-letter word.");
            return;
        }
        attempts++;
        handleGuess(guess);
        guessInput.value = "";
      });      
}

async function validateWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        return data && data.length > 0;
    } catch (error) {
        return false;
    }
}

function createSquares() {
    const gameBoard = document.getElementById("board");

    for(let index = 0; index < 30; index++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("id", `square-${index + 1}`);
        gameBoard.appendChild(square);
    }
}

function createKeyboard() {
    const keyboardContainer = document.getElementById("keyboard");

    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("keyboard-row");
        row.forEach(letter => {
            const key = document.createElement("button");
            key.classList.add("key");
            key.setAttribute("id", `key-${letter}`);
            key.textContent = letter.toUpperCase();
            rowDiv.appendChild(key);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

function handleGuess(guess) {
    const currentRow = Math.floor((attempts-1)*5);
    const guessArray = guess.split('');
    const wordArray = word.split('');

    let letterCount = {};
    wordArray.forEach(letter => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    guessArray.forEach((letter, index) => {
        const square = document.getElementById(`square-${currentRow + index + 1}`);
        const key = document.getElementById(`key-${letter}`);
        if (letter === wordArray[index]) {
            square.style.backgroundColor = 'green';
            key.classList.add('correct');
            letterCount[letter]--;
        }
        square.textContent = letter.toUpperCase();
    });

    guessArray.forEach((letter, index) => {
        const square = document.getElementById(`square-${currentRow + index + 1}`);
        const key = document.getElementById(`key-${letter}`);
        if (square.style.backgroundColor !== 'green') {
            if (wordArray.includes(letter) && letterCount[letter] > 0) {
                square.style.backgroundColor = '#917c07';
                key.classList.add('present');
                letterCount[letter]--;
            } else {
                square.style.backgroundColor = 'grey';
                key.classList.add('absent');
            }
        }
    });

    if (guess === word) {
        alert("Congratulations! You guessed the word!");
        showRestart();
    } else if (attempts === 6) {
        alert(`You've used all attempts! The word was: ${word.toUpperCase()}`);
        showRestart();
    }
}

function showRestart() {
    const inputDiv = document.getElementById("input");
    const restartButton = document.createElement("button");
    restartButton.id = "restart";
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", resetGame);
    inputDiv.appendChild(restartButton);
}

function resetGame() {
    const gameBoard = document.getElementById("board");
    gameBoard.innerHTML = "";
    createSquares ();
    word = words[Math.floor(Math.random() * words.length)];
    console.log(`The answer is: + ${word}`);
    attempts = 0;

    const restartButton = document.getElementById("restart");
    if (restartButton) {
        restartButton.remove();
    }
    
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
}
