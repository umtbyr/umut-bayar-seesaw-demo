import { SEESAW_CENTER_POINT } from "./const.js";
import { calculateSeesawAngle, calculateTotalWeights } from "./physics.js";
import {
  getSeesawRect,
  renderObject,
  setAngle,
  setNextWeightInfo,
  setSeesawClickHandler,
  setWeightInfo,
} from "./ui.js";
import { getRandomInt } from "./utils.js";

const objects = [];
let nextWeight = getRandomInt();
setNextWeightInfo(nextWeight);

const handleOnSeesawClick = (event) => {
  const seesawRect = getSeesawRect();
  const distanceToLeftEdge = event.clientX - seesawRect.left;

  /* 
  distanceToCenter will be used in tork calculation 
  left -> +
  right -> - 
  */
  const distanceToCenter = SEESAW_CENTER_POINT - distanceToLeftEdge;

  renderObject({ positionX: distanceToLeftEdge, weight: nextWeight });
  objects.push({ distanceToCenter, weight: nextWeight });
  setAngle(calculateSeesawAngle(objects));
  setWeightInfo(calculateTotalWeights(objects));
  nextWeight = getRandomInt();
  setNextWeightInfo(nextWeight);
};
setSeesawClickHandler(handleOnSeesawClick);
