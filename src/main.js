import { calculateSeesawAngle, calculateTotalWeights } from "./physics.js";
import {
  getSeesawRect,
  renderObject,
  setAngle,
  setNextWeightInfo,
  setSeesawClickHandler,
  setWeightInfo,
} from "./ui.js";
import { getRandomInt, getCoordinateOnSeesaw } from "./utils.js";

const objects = [];
let nextWeight = getRandomInt();
let angle = 0;
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
  angle = calculateSeesawAngle(objects);
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  nextWeight = getRandomInt();
  setNextWeightInfo(nextWeight);
};

setSeesawClickHandler(handleOnSeesawClick);
