//BASED ON: https://github.com/digitaldeja0/Phaser-Apple-Catcher-Starter
import {
  scenes,
  gameSize,
  gameSpeed,
  miniGameDuration,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame3Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME3,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: gameSpeed },
        },
      },
    });
    this.playerPaddle;
    this.cursor;
    this.playerSpeed = gameSpeed + 50;
    this.target;
    this.points = 6;
    this.scoreText;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
    this.moveButtonClicked;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("phoneHorizontal", "/assets/img/phoneHorizontal.png");
    this.load.image("target", "/assets/img/batterySmall.png");
    this.load.image("arrow", "assets/img/arrowRight.png");
  }

  init(data) {
    console.log("Minigame 3");
    this.lives = data.lives;
  }

  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //Player
    this.playerPaddle = this.physics.add
      .image(gameSize.width / 2, 400, "phoneHorizontal")
      .setOrigin(0, 0);
    //Player Physics
    this.playerPaddle.setImmovable(true);
    this.playerPaddle.body.allowGravity = false;
    this.playerPaddle.setCollideWorldBounds(true);
    //Player Controls
    this.cursor = this.input.keyboard.createCursorKeys();
    //Target
    this.target = this.physics.add
      .image(Phaser.Math.Between(10, gameSize.width - 70), 0, "target")
      .setOrigin(0, 0);
    this.target.setMaxVelocity(0, gameSpeed);
    //Collision / Overlap
    this.physics.add.overlap(
      this.target,
      this.playerPaddle,
      this.targetCollision,
      null,
      this
    );

    //Screen Controls

    const leftBtn = this.add
      .image(50, gameSize.height - 150, "arrow")
      .setScale(-1, 1)
      .setInteractive();

    leftBtn.on("pointerdown", () => {
      this.moveButtonClicked = "left";
    });
    leftBtn.on("pointerup", () => {
      this.moveButtonClicked = "none";
    });

    const rightBtn = this.add
      .image(gameSize.width - 100, gameSize.height - 150, "arrow")
      .setInteractive();

    rightBtn.on("pointerdown", () => {
      this.moveButtonClicked = "right";
    });
    rightBtn.on("pointerup", () => {
      this.moveButtonClicked = "none";
    });

    //UI
    this.scoreText = this.add.text(
      gameSize.width - 270,
      10,
      "Charges left: 6",
      {
        font: "25px Arial",
        fill: "white",
      }
    );
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration * 2.4,
      this.gameOver,
      [],
      this
    );
  }
  update() {
    //Controls
    if (this.moveButtonClicked == "left") {
      this.playerPaddle.x = this.playerPaddle.x - 5;
    } else if (this.moveButtonClicked == "right") {
      this.playerPaddle.x = this.playerPaddle.x + 5;
    }

    //Target behaviour
    if (this.target.y >= gameSize.height) {
      this.targetRespawn();
    }

    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME3, this.lives);
    }

    if (this.points <= 0) {
      levelTransition(this.scene, scenes.SCENES.MINIGAME3, this.lives);
    }
  }

  //functions
  targetRespawn() {
    this.target.setY(0);
    this.target.setX(Phaser.Math.Between(10, gameSize.width - 70));
  }
  targetCollision() {
    this.targetRespawn();
    this.points--;
    this.scoreText.setText("Charges left: " + this.points);
  }
}
