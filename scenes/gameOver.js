import { scenes, gameSize } from "../globalConst";
import { levelTransition, getRandomLevel } from "../globalFunctions";

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.GAMEOVER });
    this.cursor;
    this.timedEvent;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
  }

  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);

    //UI
    const gameOverText = this.add.text(gameSize.width / 2, 200, "GAME OVER", {
      font: "70px Arial",
      fill: "white",
    });
    gameOverText.setOrigin(0.5, 0.5);
    const gOmessage = this.add.text(
      gameSize.width / 2,
      300,
      "You run out of charge :(",
      {
        font: "40px Arial",
        fill: "white",
      }
    );
    gOmessage.setOrigin(0.5, 0.5);

    //Time
    this.timedEvent = this.time.delayedCall(
      3000,
      this.goToMainScreen,
      [],
      this
    );
  }

  update() {}

  goToMainScreen() {
    //levelSuccess(this.scene, scenes.SCENES.MINIGAME1, this.lives);
    this.scene.start(scenes.SCENES.BOOT);
  }
}
