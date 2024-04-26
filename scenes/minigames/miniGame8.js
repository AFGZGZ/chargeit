import {
  scenes,
  gameSize,
  miniGameDuration,
  gameSpeed,
} from "../../globalConst";
import { levelTransition } from "../../globalFunctions";

export class MiniGame8Scene extends Phaser.Scene {
  constructor() {
    super({
      key: scenes.SCENES.MINIGAME8,
    });
    this.lives;
    this.timeText;
    this.remainingTime;
    this.timedEvent;
    this.cards;
    this.flippedCards = [];
    this.canFlip = true;
    this.remainingCards = 8;
  }

  preload() {
    this.load.image("bg", "/assets/img/bg.png");
    this.load.spritesheet("cards", "assets/img/cards.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
  }

  init(data) {
    console.log("Minigame 8");
    this.lives = data.lives;
  }

  create() {
    // Add background
    this.add
      .image(0, 0, "bg")
      .setOrigin(0, 0)
      .setDisplaySize(gameSize.width, gameSize.height);
    this.cards = this.add.group();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const x = 150 + j * 150;
        const y = 150 + i * 200;
        const card = this.add.sprite(x, y, "cards", Phaser.Math.Between(0, 5));
        card.setInteractive();
        card.on("pointerdown", () => this.flipCard(card));
        card.setScale(0.5, 0.5);
        this.cards.add(card);
      }
    }
    this.timeText = this.add.text(10, 10, "TIME: ", {
      font: "25px Arial",
      fill: "white",
    });
    //Time
    this.timedEvent = this.time.delayedCall(
      miniGameDuration * 4,
      this.go,
      [],
      this
    );
  }

  update() {
    if (this.remainingCards == 0) {
      this.flippedCards = [];
      this.canFlip = true;
      levelTransition(this.scene, scenes.SCENES.MINIGAME7, this.lives);
    }
    //Time
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.timeText.setText(`TIME: ${Math.floor(this.remainingTime)}`);
    if (this.remainingTime <= 0) {
      this.flippedCards = [];
      this.canFlip = true;
      this.lives--;
      levelTransition(this.scene, scenes.SCENES.MINIGAME7, this.lives);
    }
  }
  //Control functions
  flipCard(card) {
    console.log(card.tint);
    if (
      !this.canFlip ||
      this.flippedCards.length >= 2 ||
      this.flippedCards.includes(card) ||
      card.tint == 65280
    ) {
      return;
    }

    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    this.canFlip = false;
    const [card1, card2] = this.flippedCards;
    console.log(card1);
    console.log(card2.frame.name);
    if (card1.frame.name === card2.frame.name) {
      this.flippedCards = [];
      this.canFlip = true;
      card1.setTint(0x00ff00);
      card2.setTint(0x00ff00);
      this.cards.remove(card1);
      this.cards.remove(card2);
      this.remainingCards = this.remainingCards - 2;
    } else {
      var newFrame;
      var previousFrame = card2.frame.name;
      this.time.delayedCall(300, () => {
        do {
          newFrame = card2.setFrame(Phaser.Math.Between(0, 5));
          //card1.setFrame(Phaser.Math.Between(0, 5));
        } while (newFrame === previousFrame);

        this.flippedCards = [];
        this.canFlip = true;
      });
    }
  }
}
