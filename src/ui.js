import { OBJECT_SIZE_FACTOR } from "./const.js";
import { getRandomColor } from "./utils.js";

const seesaw = document.querySelector("#seesaw");
const nextWeightInfo = document.querySelector("#next-weight-info");
const leftWeightInfo = document.querySelector("#left-weight-info");
const rightWeightInfo = document.querySelector("#right-weight-info");
const tiltAngleInfo = document.querySelector("#tilt-angle-info");

export const renderObject = ({ positionX, weight }) => {
  console.log(positionX, weight);

  const object = document.createElement("div");
  object.className = "object";
  //since we make the object's position absolute it will be positioned relative to seesaw (because objects are children of the seesaw)
  object.style.left = positionX + "px";
  object.style.width = weight * OBJECT_SIZE_FACTOR + "px";
  object.style.height = weight * OBJECT_SIZE_FACTOR + "px";
  object.style.background = getRandomColor();
  object.textContent = weight;
  seesaw.appendChild(object);
};

export const setAngle = (angle) => {
  tiltAngleInfo.textContent = angle.toFixed(2);
  seesaw.style.transform = `translateX(-50%) translateY(-50%) rotate(${angle}deg)`;
};

export const setWeightInfo = ({ leftWeight, rightWeight }) => {
  leftWeightInfo.textContent = leftWeight;
  rightWeightInfo.textContent = rightWeight;
};

export const setNextWeightInfo = (nextWeight) => {
  nextWeightInfo.textContent = nextWeight;
};

export const getSeesawRect = () => {
  return seesaw.getBoundingClientRect();
};

export const setSeesawClickHandler = (handler) => {
  seesaw.addEventListener("click", handler);
};
