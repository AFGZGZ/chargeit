import { scenes } from "./globalConst";

//GAME FLOW
export const levelTransition = function (scene, currentLevel, currentLives) {
  if (currentLives > 0) {
    const data = { lives: currentLives, originLevel: currentLevel };
    scene.start(scenes.SCENES.MINIGAMEINTRO, data);
  } else {
    scene.start(scenes.SCENES.GAMEOVER);
  }
};

//UTILS
export const getRandomLevel = function (previousScene) {
  let filteredScenes = [
    previousScene,
    scenes.SCENES.BOOT,
    scenes.SCENES.GAMEOVER,
    scenes.SCENES.MINIGAMEINTRO,
  ];

  const availableScenes = Object.keys(scenes.SCENES).filter(
    (scene) => !filteredScenes.includes(scene)
  );

  const randomSceneKey =
    availableScenes[Math.floor(Math.random() * availableScenes.length)];

  return scenes.SCENES[randomSceneKey];
};

export const sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
