import { scenes, gameSize, miniGameDuration } from "../../globalConst";
import { levelTransition, sleep } from "../../globalFunctions";

export class MiniGame6Scene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAME6 });
    this.cursor;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
    this.wheel;
    this.spinning = false;
    this.spinSpeed = 0;
    this.spinAcceleration = 20;
    this.overlapAngle = 0;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("roulette", "/assets/img/wheel.png");
    //this.load.image("roulette", "/assets/img/wheel.png");
  }

  init(data) {
    console.log("Minigame 6");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);

    //Roulette
    this.wheel = this.add.image(gameSize.width / 2, 100, "roulette");
    this.wheel.setPosition(200, 250);
    this.wheel.setDisplaySize(300, 300);

    //Player Controls
    this.spinButton = this.add
      .text(gameSize.width / 2 + 100, 200, "SPIN", {
        fontSize: "32px",
        fill: "white",
      })
      .setInteractive();
    this.spinButton.on("pointerdown", this.startSpin, this);
    this.stopButton = this.add
      .text(gameSize.width / 2 + 100, 250, "STOP", {
        fontSize: "32px",
        fill: "white",
      })
      .setInteractive();
    this.stopButton.on("pointerdown", this.stopSpin, this);
    //UI
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });

    //Collision
    this.collider = this.add.rectangle(200, 150 - 20, 20, 20, 0xffffff);
    this.physics.add.existing(this.collider);
    this.physics.add.existing(this.wheel);

    this.physics.add.overlap(
      this.collider,
      this.wheel,
      this.targetCollision,
      null,
      this
    );

    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration * 2,
      this.gameOver,
      [],
      this
    );
  }

  update() {
    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      levelTransition(this.scene, scenes.SCENES.MINIGAME6, this.lives);
    }
  }

  //Control functions
  targetCollision() {
    var dx = this.collider.x - this.wheel.x;
    var dy = this.collider.y - this.wheel.y;
    this.overlapAngle = Math.atan2(dy, dx) * Phaser.Math.RAD_TO_DEG;
    this.overlapAngle -= this.wheel.rotation * Phaser.Math.RAD_TO_DEG;
    this.overlapAngle = Phaser.Math.Wrap(this.overlapAngle, 0, 360);
  }

  startSpin() {
    if (!this.spinning) {
      this.spinning = true;
      this.spinSpeed = Phaser.Math.Between(75, 150);
      this.spinWheel();
    }
  }

  spinWheel() {
    if (this.spinning) {
      this.wheel.angle += this.spinSpeed;

      if (this.spinSpeed <= 0) {
        this.spinning = false;
        this.determineOutcome();
      } else {
        // Continue spinning
        this.time.delayedCall(100, this.spinWheel, [], this);
      }
    }
  }

  stopSpin() {
    // Add tween
    if (this.spinning) {
      do {
        this.spinSpeed -= this.spinAcceleration;
      } while (this.spinSpeed > 0);
    }
  }

  determineOutcome() {
    //console.log("Overlap angle:", Math.floor(this.overlapAngle));
    if (
      Math.floor(this.overlapAngle) > 180 &&
      Math.floor(this.overlapAngle) < 270
    ) {
      this.lives++;
      this.time.delayedCall(1000, this.goToNextLevel, null, this);
    } else if (
      Math.floor(this.overlapAngle) > 90 &&
      Math.floor(this.overlapAngle) < 180
    ) {
      this.lives--;
      this.time.delayedCall(1000, this.goToNextLevel, null, this);
    } else if (
      Math.floor(this.overlapAngle) > 0 &&
      Math.floor(this.overlapAngle) < 90
    ) {
      this.lives++;
      this.time.delayedCall(1000, this.goToNextLevel, null, this);
    } else if (
      Math.floor(this.overlapAngle) > 270 &&
      Math.floor(this.overlapAngle) < 360
    ) {
      this.lives--;
      this.time.delayedCall(1000, this.goToNextLevel, null, this);
    }
  }
  goToNextLevel() {
    levelTransition(this.scene, scenes.SCENES.MINIGAME6, this.lives);
  }
}
