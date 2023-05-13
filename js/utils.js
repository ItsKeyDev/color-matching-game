import { getTimerElement, getPlayAgainButton } from "./selectors.js";

function shuffle(array) {
  for (let i = array.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
export const getRandomColorPairs = (count) => {
  const colorList = [];
  const hueList = [
    "red",
    "green",
    "blue",
    "orange",
    "yellow",
    "purple",
    "pink",
    "monochrome",
  ];

  //   random count color
  for (let i = 0; i < count; i++) {
    //random color imported in randomColor lib
    const color = window.randomColor({
      luminosity: "dark",
      hue: hueList[i % hueList.length],
    });
    colorList.push(color);
  }

  const fullColorList = [...colorList, ...colorList];

  //   shuffle
  shuffle(fullColorList);
  return fullColorList;
};

export function showPlayAgainButton() {
  const buttonReplay = getPlayAgainButton();
  buttonReplay.style.display = "block";
}
export function hidePlayAgainButton() {
  const buttonReplay = getPlayAgainButton();
  buttonReplay.style.display = "none";
}
export function setTimerText(text) {
  const timerElement = getTimerElement();
  if (timerElement) timerElement.textContent = text;
}
export function createTimer({ seconds, onChange, onFinish }) {
  let interValId = null;

  function start() {
    clear();
    let currentSecond = seconds;
    interValId = setInterval(() => {
      if (onChange) onChange(currentSecond);
      currentSecond--;
      if (currentSecond < 0) {
        clear();
        onFinish();
      }
    }, 1000);
  }
  function clear() {
    clearInterval(interValId);
  }

  return {
    start,
    clear,
  };
}
