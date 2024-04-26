import {
  scenes,
  gameSize,
  miniGameDuration,
  gameSpeed,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame9Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME9,
    });
    this.ball;
    this.akPaddle;
    this.bricks;
    this.scoreText;
    this.batsLeft = 7;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.moveButtonClicked;
    this.bottomBound;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("ball", "assets/img/ball.png");
    this.load.image("arrow", "assets/img/arrowRight.png");
    this.load.image("akPaddle", "assets/img/phoneHorizontal.png");
    this.load.image("brick", "assets/img/brick.png");
  }

  init(data) {
    console.log("Minigame 9");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //
    this.akPaddle = this.physics.add.image(
      gameSize.width / 2,
      gameSize.height - 100,
      "akPaddle"
    );
    this.akPaddle.body.immovable = true;
    this.akPaddle.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(
      gameSize.width / 2,
      gameSize.height / 2,
      "ball"
    );
    this.ball.setScale(0.5, 0.5).setBounce(1).setCollideWorldBounds(true);
    //small amount of gravity to fix the horizontal bouncing problem??
    //this.ball.body.gravity.y = 10;

    this.placeBall();

    this.physics.add.collider(this.ball, this.akPaddle);

    this.bottomBound = this.physics.add
      .image(gameSize.width / 2, gameSize.height - 90, null)
      .setOrigin(0.5, 1);
    this.bottomBound.setScale(gameSize.width, 1);

    this.physics.add.overlap(
      this.bottomBound,
      this.ball,
      this.onBottomBoundCollision,
      null,
      this
    );

    this.bricks = this.physics.add.group();
    this.bricks.enableBody = true;
    var brick;
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 7; x++) {
        brick = this.bricks.create(
          gameSize.width / 2 - 220 + x * 68,
          60 + y * 52,
          "brick"
        );
        brick.body.bounce.set(1);
        brick.body.immovable = true;
        brick.setScale(1.4, 1.1);
      }
    }

    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.hitBrick,
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
      gameSize.width / 2 + 50,
      10,
      `defective batteries left: ${this.batsLeft}`,
      {
        font: "18px Arial",
        fill: "white",
      }
    );
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      15000, //miniGameDuration * 3,
      this.go,
      [],
      this
    );
  }

  update() {
    if (this.batsLeft <= 0) {
      levelTransition(this.scene, scenes.SCENES.MINIGAME9, this.lives);
    }

    this.ball.rotation += 0.1;

    if (this.moveButtonClicked == "left") {
      this.akPaddle.x = this.akPaddle.x - 5;
    } else if (this.moveButtonClicked == "right") {
      this.akPaddle.x = this.akPaddle.x + 5;
    }

    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      this.moveButtonClicked = "none";
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME9, this.lives);
    }
  }

  //functions

  placeBall() {
    this.ball.x = gameSize.width / 2;
    this.ball.y = gameSize.height - 180;
    let initialAngle =
      Math.random() * ((Math.PI / 4) * 3 - Math.PI / 4) + Math.PI / 4;
    const leftOrRight = Math.floor(Math.random() * 2);
    if (leftOrRight === 1) initialAngle = initialAngle + Math.PI;
    const vx = Math.sin(initialAngle) * gameSpeed * 1.3;
    const vy = Math.cos(initialAngle) * gameSpeed * 1.3;
    this.ball.body.velocity.x = vx;
    this.ball.body.velocity.y = -vy;
  }
  onBottomBoundCollision() {
    this.lives--;
    levelTransition(this.scene, scenes.SCENES.MINIGAME9, this.lives);
  }

  hitBrick(ball, brick) {
    this.batsLeft--;
    this.scoreText.setText(`defective batteries left: ${this.batsLeft}`);
    brick.destroy();
  }
}
