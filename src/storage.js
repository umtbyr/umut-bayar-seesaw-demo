const STORAGE_KEY = "seesaw-game-state";
let timeOut;
export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.log("Failed to save the game state! ", error);
  }
};

export const getState = () => {
  try {
    const state = localStorage.getItem(STORAGE_KEY);
    if (!state) return null;
    return JSON.parse(state);
  } catch (error) {
    console.log("Failed to load the game state! ", error);
    return null;
  }
};

export const resetState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log("Failed to reset the game state! ", error);
  }
};

export const debouncedSave = (state, delay = 500) => {
  clearTimeout(timeOut);
  timeOut = setTimeout(() => saveState(state), delay);
};
