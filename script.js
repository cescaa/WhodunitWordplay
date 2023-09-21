"use strict";

const min = 3;
const sec = 60;
const timeLimit = min * sec;
let currentTime = timeLimit;
let minCounter = min;
let secCounter = sec;
let subtInterval;
let gameEnd = false;

const timerModule = (() => {
  const introPage = document.getElementById("introPage");
  const timerText = document.getElementById("currentTime");
  const startBtn = document.getElementById("startBtn");

  timerText.innerText = `${min}:00`;

  // FUNCTION: Display and update time
  const subtractTime = () => {
    // stop subtracting when time reaches 0
    if (currentTime <= 0 || gameEnd === true) {
      clearInterval(subtInterval);
      currentTime = 0;
      setResultStyle(false);
      return;
    }
    currentTime -= 1;

    // subtract minute every 60 seconds
    if (secCounter === 0 && currentTime !== 0) {
      minCounter--;
      secCounter = sec;
    }
    timerText.innerText = `${minCounter - 1}:${String(secCounter - 1).padStart(
      2,
      "0"
    )}`;
    secCounter -= 1;
  };

  // FUNCTION: Show main game page and start time
  startBtn.addEventListener("click", () => {
    playMusic();
    subtInterval = setInterval(subtractTime, 1000);
    introPage.style.display = "none";
  });
})();

// FUNCTION: Reduce time by 10s if user guesses wrong
const reduceAvailTime = () => {
  const timePenalty = 10;
  const timerText = document.getElementById("currentTime");

  if (currentTime >= timePenalty) {
    currentTime -= timePenalty;
  } else {
    secCounter = 0;
    minCounter = 0;
    currentTime = 0;
    timerText.innerText = `0:00`;
  }
  if (secCounter >= timePenalty) {
    secCounter = secCounter - timePenalty;
  } else if (!(secCounter >= timePenalty) && minCounter > 0) {
    const timeDiff = timePenalty - secCounter;
    secCounter = sec - timeDiff;
    minCounter = minCounter - 1;
  }
};

const playMusic = () => {
  const songs = [
    new Audio("img/GhostDance-KevinMacLeod.mp3"),
    new Audio("img/DarkHallway-KevinMacLeod.mp3"),
  ];

  let currentIdx = 0;

  const restartPlaylist = () => {
    const currentSong = songs[currentIdx];
    songs[0].currentTime = 2.5;
    currentSong.play();
    currentSong.addEventListener("ended", function () {
      currentIdx = (currentIdx + 1) % songs.length;
      restartPlaylist();
    });
  };

  restartPlaylist();
};

const gameWords = [
  "Autumn",
  "Tea Cup",
  "Detective",
  "Cozy Inn",
  "Murder",
  "Fireplace",
  "Amateur Sleuth",
  "Red Herring",
  "Dinner Party",
  "Family Mansion",
  "Cable Knit",
  "Argyle Socks",
  "Pipe",
];

const randomWord = gameWords[Math.floor(Math.random() * gameWords.length)];
console.log(`ANSWER: ${randomWord}`);
const chosenWord = document.getElementById("chosenWord");
const dashedLine = document.getElementById("dashedLine");

const blankWord = [];
for (let i = 0; i < randomWord.length; i++) {
  if (randomWord[i] !== " ") {
    blankWord[i] = "_";
  } else {
    blankWord[i] = " ";
  }
}
chosenWord.innerText = blankWord.join("");
dashedLine.innerText = blankWord.join("");

const setResultStyle = (result) => {
  gameEnd === true;
  const openDoor = document.getElementById("openDoor");
  const gameFloor = document.getElementById("floor");
  const resultMsg = document.getElementById("resultMessageCont");
  const bloodPool = document.getElementById("blood");
  const bloodCorner = document.getElementById("bloodCorner");
  const wrongBox = document.getElementById("wrongBox");
  wrongBox.style.opacity = 0;

  if (result === true) {
    chosenWord.innerHTML = randomWord;
    chosenWord.style.color = "#a00b0c";
    openDoor.style.display = "block";
    openDoor.style.opacity = 1;
    resultMsg.innerHTML = `<h3>Congratulations!<br />You've unlocked The Room!</h3><button id="restartBtn">Enter Room</button>`;
  } else {
    chosenWord.style.opacity = 0;
    dashedLine.style.opacity = 0;
    resultMsg.innerHTML = `<h2>OH NOO!</h2><h3>You haven't unlocked The Room yet. Looks like you'll need to try harder!</h3><button id="restartBtn">Play Again</button>`;
    bloodPool.style.width = "100vw";
    bloodCorner.style.width = "45vw";
    resultMsg.style.bottom = "20rem";
  }
  gameFloor.style.opacity = 0;
  resultMsg.style.display = "block";

  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", function () {
    location.reload();
  });
};

// FUNCTION: Compare num of child elements with random word length to check if correct letter guesses match random word
const countChosenWordChild = () => {
  const childrenDiv = chosenWord.querySelectorAll(".highlight");
  console.log(`LENGTH: ${childrenDiv.length}, ${randomWord.length}`);

  if (randomWord.includes(" ")) {
    if (childrenDiv.length + 1 === randomWord.length) {
      setResultStyle(true);
    }
  } else {
    if (childrenDiv.length === randomWord.length) {
      setResultStyle(true);
    }
  }
};

const letterInput = document.getElementById("letterInput");
const passwordInput = document.getElementById("passwordInput");
const wrongChars = document.getElementById("wrongChars");
const wrongGuesses = [];

const changeRedColour = (inputType) => {
  const timerText = document.getElementById("currentTime");
  dashedLine.style.color = "#DD4520";
  inputType.style.border = "#DD4520 solid 3px";
  timerText.style.color = "#DD4520";
  setTimeout(() => {
    dashedLine.style.color = "white";
    inputType.style.border = "#303f67 solid 3px";
    timerText.style.color = "#e6b600";
  }, 500);
};

const clearPassPlaceHolder = () => {
  const passwordPlaceholder = document.getElementById("passPlaceholder");
  passwordPlaceholder.style.opacity = 0;
};

letterInput.addEventListener("click", () => {
  letterInput.placeholder = "";
  clearPassPlaceHolder();
});

passwordInput.addEventListener("click", () => {
  passwordInput.placeholder = "";
  clearPassPlaceHolder();
});

const displayWrongGuesses = (guessType) => {
  if (!wrongGuesses.includes(guessType)) {
    if (guessType.length === 1) {
      wrongGuesses.push(guessType);
    } else {
      wrongGuesses.push(guessType);
    }
    wrongChars.innerText = wrongGuesses.join(", ");
  }
};

// FUNCTION: Check user's LETTER input matches random keycode
letterInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // prevent refresh

    // if letter input isn't blank
    if (letterInput.value.trim() !== "") {
      const matchingIdxs = [];

      // check if  input matches
      if (randomWord.toLowerCase().includes(letterInput.value.toLowerCase())) {
        for (let i = 0; i < randomWord.length; i++) {
          if (letterInput.value.toLowerCase() === randomWord[i].toLowerCase()) {
            matchingIdxs.push(i); // store indexes of matching letters
          }
        }
        // add red colour to matching letters
        matchingIdxs.forEach((idx) => {
          blankWord[idx] = `<span class="highlight">${randomWord[idx]}</span>`;
        });
      } else {
        changeRedColour(letterInput);
        displayWrongGuesses(letterInput.value);
        reduceAvailTime();
      }
      chosenWord.innerHTML = blankWord.join("");
    }
    clearInput(letterInput);
    countChosenWordChild();
  }
});

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkWordMatch(passwordInput);
    clearInput(passwordInput);
  }
});

const checkWordMatch = (passwordInput) => {
  if (passwordInput.value.toLowerCase().trim() === randomWord.toLowerCase()) {
    clearInterval(subtInterval);
    setResultStyle(true);
  } else {
    changeRedColour(passwordInput);
    reduceAvailTime();
    displayWrongGuesses(passwordInput.value);
  }
};

const clearInput = (inputType) => {
  inputType.value = "";
};
