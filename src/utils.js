import {
  DEFAULT_SOUND_PREFERENCES,
  MAX_TILT_ANGLE,
  TILT_SENSITIVITY,
} from "./const.js";
import { getSoundPreferences, setSoundPreferences } from "./storage.js";

export const getRandomInt = () => {
  return Math.floor(Math.random() * 10) + 1;
};

export const clampAngle = (torqueDiff) => {
  let angle = torqueDiff / TILT_SENSITIVITY;
  if (angle > MAX_TILT_ANGLE) angle = 30;
  if (angle < -MAX_TILT_ANGLE) angle = -30;
  return angle;
};

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export const getCoordinateOnSeesaw = (event, seesaw, angle) => {
  /* 
  since we rotate the seesaw we should get the projection 
  of the user's click on the seesaw to 
  put the object exactly where it sholud be 
  */

  const rect = seesaw.getBoundingClientRect();

  /* getting the screen coordinates of the seesaw center */
  const screenCenterX = rect.left + rect.width / 2;
  const screenCenterY = rect.top + rect.height / 2;

  /* calculate the difference between user's click and the center of the seesaw */
  const diffX = event.clientX - screenCenterX;
  const diffY = event.clientY - screenCenterY;

  const radian = (angle * Math.PI) / 180;
  /* using dot product formula to find the distance between user's click and the center */
  const projection = diffX * Math.cos(radian) + diffY * Math.sin(radian);

  /*   using clientWidth since getBoundingClientRect().width will not give the
   exact width after rotation */
  const widthAfterRotation = seesaw.clientWidth;

  let coordinateOnSeesaw = projection + widthAfterRotation / 2;

  if (coordinateOnSeesaw < 0) coordinateOnSeesaw = 0;
  else if (coordinateOnSeesaw > widthAfterRotation)
    coordinateOnSeesaw = widthAfterRotation;
  return coordinateOnSeesaw;
};

export const createHistoryItemContent = ({ weight, distanceToCenter }) => {
  return `📦 ${weight} kg dropped on ${
    distanceToCenter > 0 ? "left" : "right"
  } side at ${distanceToCenter.toFixed(1)}px from center`;
};

export const loadSoundPreferences = () => {
  const preferences = getSoundPreferences();
  console.log(preferences);

  if (!preferences) return DEFAULT_SOUND_PREFERENCES;
  return preferences;
};
