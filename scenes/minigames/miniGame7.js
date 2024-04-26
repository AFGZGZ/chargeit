import {
  scenes,
  gameSize,
  miniGameDuration,
  gameSpeed,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame7Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME7,
    });
    this.flapper;
    this.obstacles;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
    this.overlap;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("plug", "assets/img/plug.png");
    this.load.image("pipe", "assets/img/pipe.png");
  }

  init(data) {
    console.log("Minigame 7");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    this.flapper = this.physics.add
      .sprite(100, 300, "plug")
      .setGravityY(500)
      .setScale(0.5);

    this.obstacles = this.physics.add.group();

    this.input.on("pointerdown", () => {
      this.flapper.setVelocityY(-300);
    });

    this.time.addEvent({
      delay: 1400,
      callback: this.addPipes,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.flapper,
      this.obstacles,
      this.gameOver,
      null,
      this
    );

    this.input.on("pointerdown", () => {
      this.flapper.setVelocityY(-200);
    });

    //UI
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration * 3,
      this.go,
      [],
      this
    );
  }

  update() {
    //Controls
    if (this.flapper.y <= 0 || this.flapper.y >= gameSize.width) {
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME7, this.lives);
    }

    this.obstacles.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        pipe.destroy();
      }
    });

    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      levelTransition(this.scene, scenes.SCENES.MINIGAME7, this.lives);
    }
  }
  //functions
  createPipe(x, y) {
    var pipe = this.add.sprite(x, y, "pipe").setScale(0.7, 1);
    this.obstacles.add(pipe);
    pipe.body.velocity.x = -200;
  }

  addPipes() {
    var hole = Math.floor(Math.random() * 5) + 1;
    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.createPipe(gameSize.width, i * 70);
      }
    }
  }

  gameOver() {
    this.lives--;
    levelTransition(this.scene, scenes.SCENES.MINIGAME7, this.lives);
  }
}
