import { scenes, gameSize, miniGameDuration } from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame5Scene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAME5 });
    this.avoider;
    this.cursor;
    this.points = 0;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
    this.overlap;
    this.sprites = [];
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("avoider", "/assets/img/phoneBack.png");
    this.load.image("enemy", "/assets/img/ray.png");
  }

  init(data) {
    console.log("Minigame 5");
    this.lives = data.lives;
  }

  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //Player
    this.avoider = this.physics.add
      .image(gameSize.width / 2, gameSize.height / 2, "avoider")
      .setOrigin(0.5, 0.5)
      .setScale(0.15, 0.15);
    //Player Physics
    this.avoider.setCollideWorldBounds(true);
    this.avoider.setInteractive();
    //Player Controls
    this.input.on("pointerdown", this.startDrag, this);

    const safeZone = {
      x: gameSize.width / 2,
      y: gameSize.height / 2,
      width: 100,
      height: 100,
    };
    for (let i = 0; i < 10; i++) {
      let randomX = Phaser.Math.Between(20, gameSize.width - 20);
      let randomY = Phaser.Math.Between(20, gameSize.height - 80);
      if (
        randomX >= safeZone.x &&
        randomX <= safeZone.x + safeZone.width &&
        randomY >= safeZone.y &&
        randomY <= safeZone.y + safeZone.height
      ) {
        do {
          randomX = Phaser.Math.Between(20, gameSize.width - 20);
          randomY = Phaser.Math.Between(20, gameSize.height - 80);
        } while (
          randomX >= safeZone.x &&
          randomX <= safeZone.x + safeZone.width &&
          randomY >= safeZone.y &&
          randomY <= safeZone.y + safeZone.height
        );
      }
      const sprite = this.physics.add.image(randomX, randomY, "enemy");
      sprite.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-200, 200)
      );
      sprite.setCollideWorldBounds(true);
      sprite.setBounce(1);
      this.sprites.push(sprite);
    }
    //Collision / Overlap
    this.physics.add.overlap(
      this.sprites,
      this.avoider,
      this.targetCollision,
      null,
      this
    );
    //UI
    this.scoreText = this.add.text(gameSize.width - 140, 10, "SCORE: ", {
      font: "25px Arial",
      fill: "white",
    });
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration * 2.1,
      this.gameOver,
      [],
      this
    );
  }

  update() {
    //Controls
    if (this.sprites.length < 0) {
      this.sprites.forEach((sprite) => {
        if (Phaser.Math.Between(0, 100) < 5) {
          sprite.setVelocity(
            Phaser.Math.Between(-200, 200),
            Phaser.Math.Between(-200, 200)
          );
        }
      });
    }
    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      levelTransition(this.scene, scenes.SCENES.MINIGAME5, this.lives);
    }
  }

  //Control functions
  startDrag(pointer, targets) {
    this.dragObj = targets[0];

    if (this.dragObj != undefined) {
      this.input.off("pointerdown", this.startDrag, this);
      this.dragObj.setTint(0x00ff00);
      this.input.on("pointermove", this.doDrag, this);
      this.input.on("pointerup", this.stopDrag, this);
    }
  }
  doDrag(pointer) {
    this.dragObj.x = pointer.x;
    this.dragObj.y = pointer.y;
  }
  stopDrag() {
    this.dragObj.clearTint();
    this.input.on("pointerdown", this.startDrag, this);
    this.input.off("pointermove", this.doDrag, this);
    this.input.off("pointerup", this.stopDrag, this);
  }

  targetCollision() {
    this.lives--;
    levelTransition(this.scene, scenes.SCENES.MINIGAME5, this.lives);
  }
}
