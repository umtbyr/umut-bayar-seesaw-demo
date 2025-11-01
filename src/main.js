import { SEESAW_CENTER_POINT } from "./const.js";
import { clampAngle, getRandomInt } from "./utils.js";

const seesaw = document.querySelector("#seesaw");
const nextWeightInfo = document.querySelector("#next-weight-info");
const leftWeightInfo = document.querySelector("#left-weight-info");
const rightWeightInfo = document.querySelector("#right-weight-info");
const tiltAngleInfo = document.querySelector("#tilt-angle-info");
const objects = [];
let nextWeight = getRandomInt();
nextWeightInfo.textContent = nextWeight;

seesaw.addEventListener("click", (event) => {
  const seesawHitBox = seesaw.getBoundingClientRect();
  const distanceToLeftEdge = event.clientX - seesawHitBox.left;

  /* 
  distanceToCenter will be used in tork calculation 
  left -> +
  right -> - 
  */
  const distanceToCenter = SEESAW_CENTER_POINT - distanceToLeftEdge;

  const object = document.createElement("div");
  object.className = "object";
  //since we make the object's position absolute it will be positioned relative to seesaw (because objects are children of the seesaw)
  object.style.left = distanceToLeftEdge + "px";
  object.textContent = nextWeight;
  seesaw.appendChild(object);
  objects.push({ distanceToCenter, weight: nextWeight });
  updateSeesawTilt();
  updateTotalWeights();
  updateNextWeight();
});

const updateSeesawTilt = () => {
  const tiltAngle = calculateSeesawAngle(objects);
  tiltAngleInfo.textContent = tiltAngle.toFixed(2);
  seesaw.style.transform = `translateX(-50%) translateY(-50%) rotate(${tiltAngle}deg)`;
};

const calculateSeesawAngle = (objects) => {
  /*   filter out the left and right objects
   then sum the torque values of them.
  abs is used since torque is absolute  */
  const leftTorque = objects
    .filter((object) => object.distanceToCenter > 0)
    .reduce(
      (sum, object) => sum + object.weight * Math.abs(object.distanceToCenter),
      0
    );
  const rightTorque = objects
    .filter((object) => object.distanceToCenter < 0)
    .reduce(
      (sum, object) => sum + object.weight * Math.abs(object.distanceToCenter),
      0
    );

  const torqueDiff = rightTorque - leftTorque;
  return clampAngle(torqueDiff);
};

const updateTotalWeights = () => {
  const { leftWeight, rightWeight } = calculateTotalWeights(objects);
  leftWeightInfo.textContent = leftWeight;
  rightWeightInfo.textContent = rightWeight;
};

const calculateTotalWeights = (objects) => {
  let leftWeight = 0;
  let rightWeight = 0;
  objects.forEach((object) => {
    if (object.distanceToCenter > 0) leftWeight += object.weight;
    else if (object.distanceToCenter < 0) rightWeight += object.weight;
  });
  return { leftWeight, rightWeight };
};

const updateNextWeight = () => {
  nextWeight = getRandomInt();
  nextWeightInfo.textContent = nextWeight;
};
