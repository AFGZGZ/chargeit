import { scenes, gameSize, miniGameDuration } from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame4Scene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAME4 });
    this.rButton;
    this.points = 0;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
    this.meter;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("redButton", "/assets/img/redButton.png");
    this.load.image("meterPart", "/assets/img/metterPart.png");
  }

  init(data) {
    console.log("Minigame 4");
    this.lives = data.lives;
  }

  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //Player
    this.rButton = this.add.image(400, 300, "redButton").setInteractive();
    this.rButton.setScale(0.5);
    //Player Controls
    this.rButton.on("pointerdown", this.onClickButton, this);
    this.rButton.on("pointerup", this.clearBtnTint, this);

    this.meter = this.add.image(
      gameSize.width / 2 - 100,
      gameSize.height / 2 + 50,
      "meterPart"
    );
    this.meter.setOrigin(1, 1);
    this.meter.scaleY = 1;

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
      levelTransition(this.scene, scenes.SCENES.MINIGAME4, this.lives);
    }
  }

  //functions
  onClickButton() {
    this.rButton.setTint(0x00ff00);
    this.points++;
    this.meter.scaleY = this.points;

    if (this.points >= 10) {
      this.points = 0;
      levelTransition(this.scene, scenes.SCENES.MINIGAME4, this.lives);
    }
  }

  clearBtnTint() {
    this.rButton.clearTint();
  }
}
