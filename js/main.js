import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from "./contants.js";
import {
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
  getColorBackground,
} from "./selectors.js";
import {
  getRandomColorPairs,
  setTimerText,
  showPlayAgainButton,
  hidePlayAgainButton,
  createTimer,
} from "./utils.js";

let selections = [];
let gameState = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});
function handleTimerChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2);
  setTimerText(fullSecond);
}
function handleTimerFinish() {
  //end game
  gameState = GAME_STATUS.FINISHED;
  setTimerText("Game Over 😭 !");
  showPlayAgainButton();
}

function handleColorClick(liElement) {
  const shouldBlockClick = [
    GAME_STATUS.BLOCKING,
    GAME_STATUS.FINISHED,
  ].includes(gameState);
  const isClick = liElement.classList.contains("active");
  if (!liElement || shouldBlockClick || isClick) return;

  liElement.classList.add("active");
  //push
  selections.push(liElement);
  if (selections.length < 2) return;
  //check logic
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;
  if (isMatch) {
    const colorBackground = getColorBackground();
    colorBackground.style.backgroundColor = firstColor;
    //check win
    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      //show button replay
      showPlayAgainButton();
      //show you win
      setTimerText("You Win 💯");
      timer.clear();
      gameState = GAME_STATUS.FINISHED;
    }

    selections = [];
    return;
  }
  // in case not match
  gameState = GAME_STATUS.BLOCKING;
  setTimeout(() => {
    selections[0].classList.remove("active");
    selections[1].classList.remove("active");
    // reset selections
    selections = [];
    gameState = GAME_STATUS.PLAYING;
  }, 500);
}

function initColor() {
  //random 8 pairs of color --> bind to li element
  const colorList = getRandomColorPairs(PAIRS_COUNT);
  //bind to li
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];

    const overlayElement = liElement.querySelector(".overlay");
    if (overlayElement) {
      overlayElement.style.backgroundColor = colorList[index];
    }
  });
}
function attachEventForColorList() {
  const ulElement = getColorListElement();
  if (!ulElement) return;
  ulElement.addEventListener("click", (event) => {
    if (event.target.tagName !== "LI") return;
    handleColorClick(event.target);
  });
}
function resetGame() {
  gameState = GAME_STATUS.PLAYING;
  selections = [];

  const colorElementList = getColorElementList();
  for (const colorElement of colorElementList) {
    colorElement.classList.remove("active");
  }

  hidePlayAgainButton();
  setTimerText("");
  initColor();
  startTimer();
}
function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) return;
  playAgainButton.addEventListener("click", resetGame);
}
function startTimer() {
  timer.start();
}
// main
(() => {
  initColor();
  attachEventForColorList();
  attachEventForPlayAgainButton();
  startTimer();
})();
