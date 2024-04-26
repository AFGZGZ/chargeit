import { scenes, gameSize, miniGameDuration } from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame1Scene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAME1 });
    this.cable;
    this.cursor;
    this.dropZone;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
    this.overlap;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("cable", "/assets/img/chargeCable.png");
    this.load.image("phoneBack", "/assets/img/phoneBack.png");
  }

  init(data) {
    console.log("Minigame 1");
    this.lives = data.lives;
  }

  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //Player
    this.cable = this.physics.add
      .image(gameSize.width / 2, gameSize.height - 75, "cable")
      .setOrigin(0.5, 1);
    this.cable.setInteractive().setOrigin(0.5, 0.5);
    //Player Controls
    this.input.on("pointerdown", this.startDrag, this);

    //Target
    this.dropZone = this.physics.add.image(gameSize.width / 2, 50, "phoneBack");
    //Collision / Overlap
    this.physics.add.overlap(
      this.dropZone,
      this.cable,
      this.targetCollision,
      null,
      this
    );
    //UI
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration,
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
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME1, this.lives);
    }
  }

  //Control functions

  startDrag(pointer, targets) {
    this.dragObj = targets[0];

    if (this.dragObj != undefined && this.dragObj.type != "Text") {
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
    this.stopDrag();
    levelTransition(this.scene, scenes.SCENES.MINIGAME1, this.lives);
  }
}
