import { clampAngle } from "./utils.js";

export const calculateSeesawAngle = (objects) => {
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

export const calculateTotalWeights = (objects) => {
  let leftWeight = 0;
  let rightWeight = 0;
  objects.forEach((object) => {
    if (object.distanceToCenter > 0) leftWeight += object.weight;
    else if (object.distanceToCenter < 0) rightWeight += object.weight;
  });
  return { leftWeight, rightWeight };
};
