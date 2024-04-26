import "./style.css";
import Phaser from "phaser";
import { gameSize, gameSpeed } from "./globalConst";
import {
  MiniGame1Scene,
  MiniGame2Scene,
  MiniGame3Scene,
  MiniGame4Scene,
  MiniGame5Scene,
  MiniGame6Scene,
  MiniGame7Scene,
  MiniGame8Scene,
  MiniGame9Scene,
  MiniGame10Scene,
  MiniGame11Scene,
  MiniGame12Scene,
} from "./scenes/minigames";
import { BootScene } from "./scenes/boot";
import { MiniGameIntro } from "./scenes/miniGameIntro";
import { GameOver } from "./scenes/gameOver";

const config = {
  type: Phaser.WEBGL,
  title: "Charge It!",
  render: {
    pixelArt: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 750, //gameSize.width
    height: 500, //gameSize.height
  },
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      //debug: true,
    },
  },
  scene: [
    BootScene,
    GameOver,
    MiniGameIntro,
    MiniGame1Scene,
    MiniGame2Scene,
    MiniGame3Scene,
    MiniGame4Scene,
    MiniGame5Scene,
    MiniGame6Scene,
    MiniGame7Scene,
    MiniGame8Scene,
    MiniGame9Scene,
    MiniGame10Scene,
    MiniGame11Scene,
    MiniGame12Scene,
  ],
};

const game = new Phaser.Game(config);
