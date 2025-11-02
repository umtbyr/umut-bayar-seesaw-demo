import { OBJECT_SIZE_FACTOR } from "./const.js";
import { getRandomColor } from "./utils.js";

const seesaw = document.querySelector("#seesaw");
const nextWeightInfo = document.querySelector("#next-weight-info");
const leftWeightInfo = document.querySelector("#left-weight-info");
const rightWeightInfo = document.querySelector("#right-weight-info");
const tiltAngleInfo = document.querySelector("#tilt-angle-info");
const resetButton = document.querySelector("#reset-button");
const historySection = document.querySelector("#game-history-section");
const labels = [];

export const renderObject = ({ positionX, weight }) => {
  const size = weight * OBJECT_SIZE_FACTOR + "px";
  const object = document.createElement("div");
  object.className = "object";
  //since we make the object's position absolute it will be positioned relative to seesaw (because objects are children of the seesaw)
  object.style.left = positionX + "px";
  object.style.width = size;
  object.style.height = size;
  object.style.background = getRandomColor();
  object.innerHTML = `<span class="label">${weight}</span>`;
  /*   store the label refs in runtime memory
  to not run DOM query for every angle change */
  labels.push(object.querySelector(".label"));
  seesaw.appendChild(object);
};

export const renderHistoryItem = ({ weight, distanceToCenter }) => {
  const historyItem = document.createElement("div");
  historyItem.className = "history-item";
  historyItem.textContent = `📦 ${weight} kg dropped on ${
    distanceToCenter > 0 ? "left" : "right"
  } side at ${distanceToCenter.toFixed(1)}px from center `;
  historySection.prepend(historyItem);
};

export const setAngle = (angle) => {
  tiltAngleInfo.textContent = angle.toFixed(2);
  seesaw.style.transform = `translateX(-50%) translateY(-50%) rotate(${angle}deg)`;

  labels.forEach((label) => {
    label.style.transform = `rotate(${-angle}deg)`;
  });
};

export const setWeightInfo = ({ leftWeight, rightWeight }) => {
  leftWeightInfo.textContent = leftWeight;
  rightWeightInfo.textContent = rightWeight;
};

export const setNextWeightInfo = (nextWeight) => {
  nextWeightInfo.textContent = nextWeight;
};

export const getSeesawElement = () => {
  return seesaw;
};

export const getSeesawRect = () => {
  return seesaw;
};

export const clearObjects = () => {
  seesaw.querySelectorAll(".object").forEach((object) => object.remove());
  if (labels.length > 0) labels.length = 0;
};

export const clearHistory = () => {
  historySection
    .querySelectorAll(".history-item")
    .forEach((item) => item.remove());
};

export const setResetButtonHandler = (handler) => {
  resetButton.addEventListener("click", handler);
};

export const setSeesawClickHandler = (handler) => {
  seesaw.addEventListener("click", handler);
};
