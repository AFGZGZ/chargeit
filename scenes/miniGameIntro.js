import { scenes, gameSize } from "../globalConst";
import { getRandomLevel } from "../globalFunctions";

export class MiniGameIntro extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAMEINTRO });
    this.cursor;
    this.introText;
    this.timedEvent;
    this.data;
    this.selectedLevel;
    this.pauseButton;
    this.continueButton;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("pauseButton", "/assets/img/pauseButton.png");
    this.load.image("resumeButton", "/assets/img/resumeButton.png");
  }

  init(data) {
    this.data = data;
  }

  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);

    this.selectedLevel = getRandomLevel(this.data.originLevel);
    console.log("Going to play: " + this.selectedLevel);

    //UI
    this.pauseButton = this.add.image(gameSize.width - 150, 50, "pauseButton");
    this.pauseButton
      .setInteractive()
      .setScale(0.5, 0.5)
      .on("pointerdown", this.pauseGame, this)
      .setActive(true)
      .setVisible(true);

    this.continueButton = this.add.image(
      gameSize.width - 150,
      50,
      "resumeButton"
    );
    this.continueButton
      .setInteractive()
      .setScale(0.5, 0.5)
      .on("pointerdown", this.pauseGame, this)
      .setActive(false)
      .setVisible(false);

    this.introText = this.add.text(
      gameSize.width / 2,
      275,
      scenes.introText[this.selectedLevel],
      {
        font: "30px Arial",
        fill: "white",
      }
    );
    this.introText.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: [this.introText],
      x: gameSize.width / 2,
      y: 285,
      duration: 2000,
      ease: "Power1",
      yoyo: true,
      loop: -1, // Loop indefinitely
    });

    this.add.text(
      10,
      gameSize.height - 150,
      `Charge bars remaining: ${this.data.lives}`,
      {
        font: "30px Arial",
        fill: "white",
      }
    );

    //Time
    this.timedEvent = this.time.delayedCall(1500, this.goToMiniGame, [], this);
  }

  update() {
    if (this.timedEvent.paused == true) {
      this.introText.text = "GAME PAUSED";
    } else {
      this.introText.text = scenes.introText[this.selectedLevel];
    }
  }

  goToMiniGame() {
    this.scene.start(this.selectedLevel, this.data);
  }

  pauseGame() {
    if (this.timedEvent.paused != true) {
      this.pauseButton.setActive(false).setVisible(false);
      this.continueButton.setActive(true).setVisible(true);
      this.timedEvent.paused = true;
    } else {
      this.continueButton.setActive(false).setVisible(false);
      this.pauseButton.setActive(true).setVisible(true);
      this.timedEvent.paused = false;
    }
  }
}
