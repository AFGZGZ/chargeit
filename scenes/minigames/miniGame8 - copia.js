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
    this.cardImages = [1, 2, 3, 4, 5, 6];
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
        const card = this.add.sprite(x, y, "cards");
        card.setInteractive();
        card.on("pointerdown", () => this.flipCard(card));
        card.setScale(0.5, 0.5);
        this.cards.add(card);
      }
    }
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
      miniGameDuration * 4,
      this.go,
      [],
      this
    );
  }

  update() {
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
    if (
      !this.canFlip ||
      this.flippedCards.length >= 2 ||
      this.flippedCards.includes(card)
    ) {
      return;
    }

    this.flippedCards.push(card);
    //card.setFrame(4);
    card.setFrame(Phaser.Math.Between(1, 5));
    this.tweens.add({
      targets: card,
      duration: 150,
      onComplete: () => {
        if (this.flippedCards.length === 2) {
          this.checkMatch();
        }
      },
    });
  }

  checkMatch() {
    this.canFlip = false;
    const [card1, card2] = this.flippedCards;
    console.log(card1.tint);
    console.log(card2);
    if (card1.frame.name === card2.frame.name) {
      this.flippedCards = [];
      this.canFlip = true;
      card1.setTint(0x00ff00);
      card2.setTint(0x00ff00);
      this.cards.remove(card1);
      this.cards.remove(card2);
    } else {
      this.time.delayedCall(1000, () => {
        card1.setFrame(0);
        card2.setFrame(0);
        this.flippedCards = [];
        this.canFlip = true;
      });
    }
  }
}
