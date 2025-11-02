import { calculateSeesawAngle, calculateTotalWeights } from "./physics.js";
import { SoundEffectManager } from "./soundEffectManager.js";
import { debouncedSave, getState, resetState } from "./storage.js";
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
  setMuteButtonClickHandler,
  updateMuteIcon,
  setVolumeInputClcikHandler,
  updateVolumeInput,
} from "./ui.js";
import {
  getRandomInt,
  getCoordinateOnSeesaw,
  getRandomColor,
  createHistoryItemContent,
  loadSoundPreferences,
} from "./utils.js";

const objects = [];
const historyItems = [];
SoundEffectManager.loadSound({ key: "drop", path: "/sfx/drop.wav" });
const prefs = loadSoundPreferences();
SoundEffectManager.setVolume(prefs.volume);
SoundEffectManager.setMuted(prefs.muted);
updateMuteIcon();
updateVolumeInput(prefs.volume);

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
  savedState.historyItems.forEach((historyItem) => {
    renderHistoryItem(historyItem);
    historyItems.push(historyItem);
  });
  nextWeight = savedState.nextWeight;
  angle = savedState.angle;
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  setNextWeightInfo(nextWeight);
} else {
  setNextWeightInfo(nextWeight);
}

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
  const historyItemContent = createHistoryItemContent({
    weight: nextWeight,
    distanceToCenter,
  });
  historyItems.push(historyItemContent);
  renderHistoryItem(historyItemContent);
  angle = calculateSeesawAngle(objects);
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  nextWeight = getRandomInt();
  setNextWeightInfo(nextWeight);
  SoundEffectManager.playSound("drop");
  debouncedSave({
    objects,
    nextWeight,
    angle,
    historyItems,
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
setMuteButtonClickHandler();
setVolumeInputClcikHandler();
