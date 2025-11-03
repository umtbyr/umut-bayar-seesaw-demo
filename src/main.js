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
  setSeesawMouseEventHandler,
} from "./ui.js";
import {
  getRandomInt,
  getCoordinateOnSeesaw,
  getRandomColor,
  createHistoryItemContent,
  loadSoundPreferences,
} from "./utils.js";
//states
const objects = [];
const historyItems = [];
let nextWeight = getRandomInt();
let angle = 0;

const initializeAudio = () => {
  const prefs = loadSoundPreferences();
  SoundEffectManager.loadSound({ key: "drop", path: "/sfx/drop.wav" });
  SoundEffectManager.setVolume(prefs.volume);
  SoundEffectManager.setMuted(prefs.muted);
  updateMuteIcon();
  updateVolumeInput(prefs.volume);
};
const restoreAfterReload = () => {
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
};
const bindHandlers = () => {
  setSeesawClickHandler(handleOnSeesawClick);
  setResetButtonHandler(handleReset);
  setMuteButtonClickHandler();
  setVolumeInputClcikHandler();
  setSeesawMouseEventHandler();
};

const start = () => {
  restoreAfterReload();
  initializeAudio();
  bindHandlers();
};

//handlers
function handleOnSeesawClick(event) {
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
  nextWeight = getRandomInt();
  setAngle(angle);
  setWeightInfo(calculateTotalWeights(objects));
  setNextWeightInfo(nextWeight);
  SoundEffectManager.playSound("drop");
  debouncedSave({
    objects,
    nextWeight,
    angle,
    historyItems,
  });
}

function handleReset() {
  if (objects.length > 0) objects.length = 0;
  if (historyItems.length > 0) objects.length = 0;
  angle = 0;
  setAngle(angle);
  clearObjects();
  clearHistory();
  setWeightInfo({ leftWeight: 0, rightWeight: 0 });
  nextWeight = getRandomInt();
  setNextWeightInfo(nextWeight);
  resetState();
}

start();
