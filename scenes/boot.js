import { scenes, gameSize, initialLives } from "../globalConst";
import { levelTransition } from "../globalFunctions";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.BOOT });
    this.player;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("gameTitle", "/assets/img/gameTitle.png");
    this.load.image("playButton", "/assets/img/playButton.png");
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //UI
    this.cameras.main.setBackgroundColor("#ffffff");
    const gameTitle = this.add
      .image(gameSize.width / 2, gameSize.height * 0.2, "gameTitle")
      .setDepth(1);
    const playButton = this.add
      .image(gameSize.width / 2, gameSize.height / 2, "playButton")
      .setDepth(1);
    playButton.setInteractive();

    this.tweens.add({
      targets: [gameTitle],
      x: gameSize.width / 2,
      y: gameSize.height * 0.2 + 10,
      duration: 2000,
      ease: "Power1",
      yoyo: true,
      loop: -1, // Loop indefinitely
    });

    this.add
      .text(
        gameSize.width / 2,
        gameSize.height - 130,
        "Code available at: https://github.com/AFGZGZ",
        {
          font: "15px Arial",
          fill: "white",
        }
      )
      .setOrigin(0.5, 0.5);
    //To do hoover color
    //playButton.on();
    playButton.on("pointerdown", () => {
      levelTransition(this.scene, scenes.SCENES.BOOT, initialLives);
    });
  }

  update() {
    //Controls
  }

  //Helper functions
}
