import {
  scenes,
  gameSize,
  miniGameDuration,
  gameSpeed,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame12Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME12,
    });
    this.hitter;
    this.bball;
    this.timedEvent;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.image("phoneBall", "assets/img/phoneBack.png");
    this.load.image("bat", "assets/img/bat.png");
  }

  init(data) {
    console.log("Minigame 12");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);

    this.hitter = this.physics.add
      .image(gameSize.width / 2 - 40, 450, "bat")
      .setScale(1, 0.5)
      .setOrigin(1, 0.5);
    this.hitter.body.immovable = true;

    this.bball = this.physics.add
      .image(gameSize.width / 2, 100, "phoneBall")
      .setScale(0.1);

    this.physics.add.collider(
      this.bball,
      this.hitter,
      this.hitBall,
      null,
      this
    );

    this.timedEvent = this.time.delayedCall(300, this.setBallMotion, [], this);
    this.input.on("pointerdown", this.swingBat, this);
  }

  update() {
    // if (this.hit != true) {
    //   this.physics.moveToObject(this.bball, this.hitter, 200);
    // }

    var ballBounds = this.bball.getBounds();
    var playerBounds = this.hitter.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(ballBounds, playerBounds)) {
      var angle = Phaser.Math.DegToRad(this.hitter.angle);
      var speed = this.bball.body.velocity.y;
      var velocityX = Math.cos(angle) * speed;
      var velocityY = -speed;
      this.bball.setVelocity(velocityX, velocityY);
    }

    // if (this.bball.velocityX == 0 || this.bball.velocityY == 0) {
    // }

    if (this.bball.y < 0 || this.bball.x < 0 || this.bball.x > gameSize.width) {
      this.hit = false;
      //this.resetBall.call(this);
      levelTransition(this.scene, scenes.SCENES.MINIGAME12, this.lives);
    }

    if (this.bball.y > gameSize.height) {
      this.hit = false;
      //this.resetBall.call(this);
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME12, this.lives);
    }
  }

  //Control functions

  setBallMotion() {
    this.bball.setVelocityY(Phaser.Math.Between(400, 900));
  }

  hitBall() {
    this.bball.setVelocity(
      Phaser.Math.Between(-500, -800),
      Phaser.Math.Between(-200, -400)
    );
  }

  swingBat() {
    this.tweens.add({
      targets: this.hitter,
      angle: -360,
      duration: 200,
      ease: "Linear",
      //yoyo: true,
    });
  }
}
