import {
  scenes,
  gameSize,
  miniGameDuration,
  gameSpeed,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame10Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME10,
    });
    this.phoneRocket;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.detonateButton;
    this.successfulDetonation;
    this.detonationArea;
    this.randomYPos = Phaser.Math.Between(60, 200);
    this.detonated = false;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("semson", "assets/img/semson.png");
  }

  init(data) {
    console.log("Minigame 10");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //
    this.phoneRocket = this.add
      .sprite(gameSize.width / 2 - 100, gameSize.height, "semson")
      .setScale(0.6, 0.6);
    this.detonateButton = this.add
      .text(gameSize.width / 2 + 100, 250, "DETONATE", {
        fontSize: "40px",
        fill: "yellow",
      })
      .setInteractive();

    // Draw the success area
    this.detonationArea = this.add.graphics();

    // Define button click event
    this.detonateButton.on("pointerdown", () => {
      this.detonated = true;
      if (this.successfulDetonation) {
        this.scoreText.text = "Success! You timed it right!";
        this.scoreText.setVisible(true);
        this.phoneRocket.y = this.time.delayedCall(
          2000,
          this.detonation,
          [],
          this
        );
      } else {
        this.lives--;
        this.scoreText.text = "Fail! Outside of safe area!";
        this.scoreText.setVisible(true);
        this.phoneRocket.y = this.time.delayedCall(
          2000,
          this.detonation,
          [],
          this
        );
      }
    });

    //UI
    this.scoreText = this.add
      .text(gameSize.width / 2, 350, "", {
        font: "25px Arial",
        fill: "white",
      })
      .setVisible(false);
  }

  update() {
    if (this.detonated == false) {
      this.phoneRocket.y -= 3;
    }

    if (this.phoneRocket.y <= 0) {
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME10, this.lives);
    }
    if (
      this.phoneRocket.y > this.randomYPos &&
      this.phoneRocket.y < this.randomYPos + 120
    ) {
      this.successfulDetonation = true;
      this.detonationArea.clear();
      this.detonationArea.lineStyle(3, 0xff0000, 1);
      this.detonationArea.strokeRect(
        gameSize.width / 2 - 150,
        this.randomYPos,
        120,
        120
      );
    } else {
      this.successfulDetonation = false;
      this.detonationArea.clear();
      this.detonationArea.lineStyle(2, 0x00ff00, 1);
      this.detonationArea.strokeRect(
        gameSize.width / 2 - 150,
        this.randomYPos,
        120,
        120
      );
    }
  }
  detonation() {
    levelTransition(this.scene, scenes.SCENES.MINIGAME10, this.lives);
  }
}
