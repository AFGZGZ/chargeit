//BASED ON: https://www.emanueleferonato.com/2020/02/12/build-a-html5-game-like-surfingers-using-phaser-and-arcade-physics/
import { scenes, gameSize, miniGameDuration } from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

let gameOptions = {
  platformWidth: 300,
  platformVerticalPositions: 5,
  platformVerticalGap: 50,
  platformSpeed: 150,
  playerSize: [50, 85],
};

export class MiniGame2Scene extends Phaser.Scene {
  constructor() {
    super({ key: scenes.SCENES.MINIGAME2 });
    this.surfer;
    this.cursor;
    this.target;
    this.points = 0;
    this.scoreText;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.lives;
  }

  preload() {
    this.load.image("phoneSurfer", "/assets/img/phoneBack.png");
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("buildingTile", "assets/img/buildingTile.png");
  }
  init(data) {
    console.log("Minigame 2");
    this.lives = data.lives;
  }
  create() {
    //BG
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    //
    this.platformGroup = this.physics.add.group();
    this.platformArray = [];
    this.leftmostPlatform = 0;
    this.moveablePlatform = 1;
    this.collidingPlatform = 2;
    let platformsInGame =
      Math.ceil(gameSize.width / gameOptions.platformWidth) * 2;
    for (let i = 0; i < platformsInGame; i++) {
      let posX = gameOptions.platformWidth * i;
      let platformTopY =
        gameSize.height / 2 -
        (gameOptions.platformVerticalPositions *
          gameOptions.platformVerticalGap) /
          2;
      let posY =
        platformTopY +
        Phaser.Math.Between(0, gameOptions.platformVerticalPositions) *
          gameOptions.platformVerticalGap;
      let platform = this.platformGroup.create(posX, posY, "buildingTile");
      platform.setOrigin(0, 0);
      platform.displayWidth = gameOptions.platformWidth;
      platform.displayHeight = gameSize.height;
      if (i == 1) {
        platform.alpha = 0.5;
        platform.y = this.platformArray[0].y;
      }
      this.platformArray.push(platform);
    }
    this.platformGroup.setVelocityX(-gameOptions.platformSpeed);
    this.surfer = this.add.sprite(
      this.platformArray[this.leftmostPlatform].getBounds().right +
        gameOptions.playerSize[0],
      this.platformArray[this.leftmostPlatform].getBounds().top,
      "phoneSurfer"
    );
    this.surfer.setOrigin(1, 1);
    this.surfer.displayWidth = gameOptions.playerSize[0];
    this.surfer.displayHeight = gameOptions.playerSize[1];
    this.input.on("pointerup", this.endSwipe, this);

    //UI
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration * 3,
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
      levelTransition(this.scene, scenes.SCENES.MINIGAME2, this.lives);
    }

    if (this.platformArray[this.leftmostPlatform].getBounds().right < 0) {
      let rightmostPlatform = Phaser.Math.Wrap(
        this.leftmostPlatform - 1,
        0,
        this.platformArray.length
      );
      let platformTopY =
        gameSize.height / 2 -
        (gameOptions.platformVerticalPositions *
          gameOptions.platformVerticalGap) /
          2;
      let posY =
        platformTopY +
        Phaser.Math.Between(0, gameOptions.platformVerticalPositions) *
          gameOptions.platformVerticalGap;
      this.platformArray[this.leftmostPlatform].y = posY;
      this.platformArray[this.leftmostPlatform].x =
        this.platformArray[rightmostPlatform].getBounds().right;
      this.platformArray[this.moveablePlatform].alpha = 1;
      this.leftmostPlatform = Phaser.Math.Wrap(
        this.leftmostPlatform + 1,
        0,
        this.platformArray.length
      );
      this.moveablePlatform = Phaser.Math.Wrap(
        this.leftmostPlatform + 1,
        0,
        this.platformArray.length
      );
      this.collidingPlatform = Phaser.Math.Wrap(
        this.moveablePlatform + 1,
        0,
        this.platformArray.length
      );
      this.platformArray[this.moveablePlatform].alpha = 0.5;
    }
    if (
      this.platformArray[this.collidingPlatform].getBounds().left <
      this.surfer.getBounds().right
    ) {
      if (
        this.platformArray[this.collidingPlatform].y !=
        this.platformArray[this.moveablePlatform].y
      ) {
        this.lives--;
        levelTransition(this.scene, scenes.SCENES.MINIGAME2, this.lives);
      }
    }
  }

  //Helper functions
  endSwipe(e) {
    let swipeTime = e.upTime - e.downTime;
    let swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
    let swipeNormal = new Phaser.Geom.Point(
      swipe.x / swipeMagnitude,
      swipe.y / swipeMagnitude
    );
    if (
      swipeMagnitude > 20 &&
      swipeTime < 1000 &&
      (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)
    ) {
      if (swipeNormal.y > 0.8) {
        this.platformArray[this.moveablePlatform].y +=
          gameOptions.platformVerticalGap;
        this.surfer.y += gameOptions.platformVerticalGap;
      }
      if (swipeNormal.y < -0.8) {
        this.platformArray[this.moveablePlatform].y -=
          gameOptions.platformVerticalGap;
        this.surfer.y -= gameOptions.platformVerticalGap;
      }
    }
  }
}
