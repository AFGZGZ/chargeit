import { scenes, gameSize, miniGameDuration } from "../../globalConst";
import { levelTransition } from "../../globalFunctions";
import PausePlugin from "../../plugins/pauseButton";

export class MiniGameXScene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAMEX });
    //this.player;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
  }

  preload() {
    //this.load.image("player", "/assets/player.png");
  }

  init(data) {
    console.log("Minigame X");
    this.lives = data.lives;
  }

  create() {
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
  }

  //Functions
}
