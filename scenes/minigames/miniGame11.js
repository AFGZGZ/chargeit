import {
  scenes,
  gameSize,
  miniGameDuration,
  gameSpeed,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame11Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME11,
    });
    this.lives;
    this.cells;
    this.chargedCells;
    this.numberOfCells = Phaser.Math.Between(3, 8);
    this.scoreText;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("circle", "assets/img/cell.png");
  }

  init(data) {
    console.log("Minigame 11");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //

    this.cells = this.physics.add.group();
    this.chargedCells = this.physics.add.group();

    for (var i = 0; i < this.numberOfCells; i++) {
      var x = Phaser.Math.Between(50, 750);
      var y = Phaser.Math.Between(50, 550);
      var cell = this.cells.create(x, y, "circle");
      cell.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-200, 200)
      );
      cell.setBounce(1, 1);
      cell.setScale(0.4);
      cell.setCollideWorldBounds(true);
    }

    // Set collision detection
    this.physics.add.collider(
      this.cells,
      this.cells,
      this.circleCollision,
      null,
      this
    );

    //UI
    this.scoreText = this.add.text(
      gameSize.width - 200,
      10,
      `Uncharged cells  ${this.numberOfCells}`,
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
      miniGameDuration * 2,
      this.go,
      [],
      this
    );

    this.cells.children.iterate(function (child) {
      child.setInteractive();
      child.on("pointerdown", function () {
        this.setVelocity(
          Phaser.Math.Between(-200, 200),
          Phaser.Math.Between(-200, 200)
        );
      });
    }, this);
  }

  update() {
    if (this.numberOfCells - this.chargedCells.getLength() == 0) {
      levelTransition(this.scene, scenes.SCENES.MINIGAME11, this.lives);
    }
    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME11, this.lives);
    }
  }

  circleCollision(ball, ball2) {
    //this.cells.remove(ball);
    //this.cells.remove(ball2);
    this.chargedCells.add(ball);
    this.chargedCells.add(ball2);
    ball.setTint(0x00ff00);
    ball2.setTint(0x00ff00);
    this.scoreText.setText(
      `Uncharged cells  ${this.numberOfCells - this.chargedCells.getLength()}`
    );
  }
}
