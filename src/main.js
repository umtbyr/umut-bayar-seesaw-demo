import { SEESAW_CENTER_POINT } from "./const.js";
import { calculateSeesawAngle, calculateTotalWeights } from "./physics.js";
import { getState, saveState } from "./storage.js";
import {
  clearObjects,
  getSeesawRect,
  renderObject,
  setAngle,
  setNextWeightInfo,
  setResetButtonHandler,
  setSeesawClickHandler,
  setWeightInfo,
  renderHistoryItem,
  clearHistory,
} from "./ui.js";
import { getRandomInt, getCoordinateOnSeesaw } from "./utils.js";

const objects = [];
let nextWeight = getRandomInt();
let angle = 0;
const savedState = getState();
if (savedState) {
  savedState.objects.forEach((object) => {
    renderObject({
      positionX: SEESAW_CENTER_POINT - object.distanceToCenter,
      weight: object.weight,
    });
    objects.push(object);
  });
  nextWeight = savedState.nextWeight;
  angle = savedState.angle;
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  setNextWeightInfo(nextWeight);
}
setNextWeightInfo(nextWeight);

const handleOnSeesawClick = (event) => {
  const seesaw = getSeesawRect();
  const leftPx = getCoordinateOnSeesaw(event, seesaw, angle);
  renderObject({ positionX: leftPx, weight: nextWeight });
  /* 
  distanceToCenter will be used in tork calculation 
  left -> +
  right -> - 
  */
  const center = seesaw.clientWidth / 2;
  const distanceToCenter = center - leftPx;
  objects.push({ distanceToCenter, weight: nextWeight });
  renderHistoryItem({ distanceToCenter, weight: nextWeight });
  angle = calculateSeesawAngle(objects);
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  nextWeight = getRandomInt();
  setNextWeightInfo(nextWeight);
  saveState({
    objects,
    nextWeight,
    angle,
  });
};

const handleReset = () => {
  if (objects.length > 0) objects.length = 0;
  angle = 0;
  setAngle(angle);
  clearObjects();
  clearHistory();
  setWeightInfo({ leftWeight: 0, rightWeight: 0 });
  nextWeight = getRandomInt();
  saveState({ angle, objects: [], nextWeight });
};

setSeesawClickHandler(handleOnSeesawClick);
setResetButtonHandler(handleReset);
