import { calculateSeesawAngle, calculateTotalWeights } from "./physics.js";
import { debouncedSave, getState, resetState, saveState } from "./storage.js";
import {
  clearObjects,
  renderObject,
  setAngle,
  setNextWeightInfo,
  setResetButtonHandler,
  setSeesawClickHandler,
  setWeightInfo,
  renderHistoryItem,
  clearHistory,
  getSeesawElement,
} from "./ui.js";
import {
  getRandomInt,
  getCoordinateOnSeesaw,
  getRandomColor,
} from "./utils.js";

const objects = [];
let nextWeight = getRandomInt();
let angle = 0;
const savedState = getState();
if (savedState) {
  savedState.objects.forEach((object) => {
    renderObject({
      positionX: getSeesawElement().clientWidth / 2 - object.distanceToCenter,
      weight: object.weight,
      color: object.color,
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
  const seesaw = getSeesawElement();
  const leftPx = getCoordinateOnSeesaw(event, seesaw, angle);
  const color = getRandomColor();
  renderObject({ positionX: leftPx, weight: nextWeight, color });
  /* 
  distanceToCenter will be used in tork calculation 
  left -> +
  right -> - 
  */
  const center = seesaw.clientWidth / 2;
  const distanceToCenter = center - leftPx;
  objects.push({ distanceToCenter, weight: nextWeight, color });
  renderHistoryItem({ distanceToCenter, weight: nextWeight });
  angle = calculateSeesawAngle(objects);
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  nextWeight = getRandomInt();
  setNextWeightInfo(nextWeight);
  debouncedSave({
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
  resetState();
};

setSeesawClickHandler(handleOnSeesawClick);
setResetButtonHandler(handleReset);
