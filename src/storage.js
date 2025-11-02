const STORAGE_KEY_GAME_STATE = "seesaw-game-state";
const STORAGE_KEY_SOUND_PREFERENCES = "sound-preferences";
let timeOutGameState;
let timeOutSoundPrefs;

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY_GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.log("Failed to save the game state! ", error);
  }
};

export const getState = () => {
  try {
    const state = localStorage.getItem(STORAGE_KEY_GAME_STATE);
    if (!state) return null;
    return JSON.parse(state);
  } catch (error) {
    console.log("Failed to load the game state! ", error);
    return null;
  }
};

export const resetState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_GAME_STATE);
  } catch (error) {
    console.log("Failed to reset the game state! ", error);
  }
};

export const debouncedSave = (state, delay = 500) => {
  clearTimeout(timeOutGameState);
  timeOutGameState = setTimeout(() => saveState(state), delay);
};

export const getSoundPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEY_SOUND_PREFERENCES);
    if (!preferences) return null;
    return JSON.parse(preferences);
  } catch (error) {
    console.log("Failed to load sound preferences ", error);
    return null;
  }
};

export const setSoundPreferences = (preferences) => {
  const currentPrefs = getSoundPreferences();
  const mergedPrefs = {
    ...currentPrefs,
    ...preferences,
  };
  try {
    localStorage.setItem(
      STORAGE_KEY_SOUND_PREFERENCES,
      JSON.stringify(mergedPrefs)
    );
  } catch (error) {
    console.log("Failed to save sound preferences ", error);
  }
};

export const setSoundPreferencesDebounced = (preferences, delay = 500) => {
  clearTimeout(timeOutSoundPrefs);
  timeOutSoundPrefs = setTimeout(() => setSoundPreferences(preferences), delay);
};
