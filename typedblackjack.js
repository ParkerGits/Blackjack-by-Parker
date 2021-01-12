// Blackjack in TypeScript
// Created to practice Object Oriented Programming in Typescript.
const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
];
const SUITS = ["D", "S", "C", "H"];
const CARD_WIDTH = 150;
const CARD_HEIGHT = 230;
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    get string() {
        return this.rank + this.suit;
    }
    get value() {
        // returns 0 if ace
        if (this.rank == "2" ||
            this.rank == "3" ||
            this.rank == "4" ||
            this.rank == "5" ||
            this.rank == "6" ||
            this.rank == "7" ||
            this.rank == "8" ||
            this.rank == "9") {
            return parseInt(this.rank);
        }
        else if (this.rank == "10" ||
            this.rank == "J" ||
            this.rank == "Q" ||
            this.rank == "K") {
            return 10;
        }
        else if (this.rank == "A") {
            return 0;
        }
    }
}
class Deck {
    constructor() {
        this._cards = [];
        for (let i = 0; i < RANKS.length; i++) {
            for (let j = 0; j < SUITS.length; j++) {
                this._cards.push(new Card(RANKS[i], SUITS[j]));
            }
        }
    }
    shuffle() {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
    }
    print() {
        for (let i = 0; i < this.cards.length; i++) {
            console.log(this.cards[i].string);
        }
    }
    get cards() {
        return this._cards;
    }
}
class Hand {
    constructor(cardOne, cardTwo, isDealer) {
        this.cards = [cardOne, cardTwo];
        this.isDealer = isDealer;
        this._hasBust = false;
        if (this.isDealer) {
            this.handElement = document.getElementById("dealerHand");
        }
        else {
            this.handElement = document.getElementById("playerHand");
            document.getElementById("playerHandValue").innerHTML =
                "Soft Hand Value: " + this.value;
        }
        let visualCardOne = document.createElement("li");
        let visualCardTwo = document.createElement("li");
        let cardOnePicture = document.createElement("img");
        let cardTwoPicture = document.createElement("img");
        cardOnePicture.src = "img/" + cardOne.string + ".png";
        cardOnePicture.width = CARD_WIDTH;
        cardOnePicture.height = CARD_HEIGHT;
        visualCardOne.appendChild(cardOnePicture);
        if (this.isDealer) {
            cardTwoPicture.src = "img/red_back.png";
            cardTwoPicture.id = "hiddenCard";
        }
        else {
            cardTwoPicture.src = "img/" + cardTwo.string + ".png";
        }
        cardTwoPicture.width = CARD_WIDTH;
        cardTwoPicture.height = CARD_HEIGHT;
        visualCardTwo.appendChild(cardTwoPicture);
        this.handElement.appendChild(visualCardOne);
        this.handElement.appendChild(visualCardTwo);
    }
    addCard(card) {
        if (this.value <= 21) {
            this.cards.push(card);
            console.log(this.cards);
            let visualNewCard = document.createElement("li");
            let newCardPicture = document.createElement("img");
            newCardPicture.src = "img/" + card.string + ".png";
            newCardPicture.width = CARD_WIDTH;
            newCardPicture.height = CARD_HEIGHT;
            visualNewCard.appendChild(newCardPicture);
            this.handElement.appendChild(visualNewCard);
            if (this.value <= 21 && !this.isDealer) {
                document.getElementById("playerHandValue").innerHTML =
                    "Soft Hand Value: " + this.value;
            }
            else if (this.value > 21 && !this.isDealer) {
                document.getElementById("playerHandValue").innerHTML = "BUST!";
                this._hasBust = true;
                let hitButton = document.getElementById("hitButton");
                let standButton = document.getElementById("standButton");
                hitButton.disabled = true;
                standButton.disabled = true;
            }
        }
    }
    showSecondCard() {
        let hiddenCard = (document.getElementById("hiddenCard"));
        hiddenCard.src = "img/" + this.cards[1].string + ".png";
    }
    get value() {
        let aceCount = 0;
        let valueSum = 0;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].value == 0) {
                aceCount++;
            }
            else {
                valueSum += this.cards[i].value;
            }
        }
        for (let i = 0; i < aceCount; i++) {
            if (valueSum > 10) {
                valueSum += 1;
            }
            else {
                valueSum += 11;
            }
        }
        return valueSum;
    }
    get hasBust() {
        return this._hasBust;
    }
    set hasBust(value) {
        this._hasBust = value;
    }
}
let dealerDraw = (playerHand, dealerHand, deck) => {
    dealerHand.showSecondCard();
    while (dealerHand.value < playerHand.value && dealerHand.value <= 21) {
        dealerHand.addCard(deck.cards.pop());
    }
    if (dealerHand.value > 21) {
        dealerHand.hasBust = true;
    }
};
let showPlayAgain = () => {
    document.getElementById("playAgainButton").style.display = "inline";
};
let dealerWins = (dealerHand) => {
    document.getElementById("winnerText").innerHTML = "Dealer Hand Value: " + dealerHand.value + " - Dealer Wins!";
    showPlayAgain();
};
let playerWins = (dealerHand) => {
    if (dealerHand.hasBust) {
        document.getElementById("winnerText").innerHTML = "Dealer Busts! - Player Wins!";
    }
    else {
        document.getElementById("winnerText").innerHTML = "Dealer Hand Value: " + dealerHand.value + " - Player Wins!";
    }
    showPlayAgain();
};
let draw = (dealerHand) => {
    document.getElementById("winnerText").innerHTML = "Dealer Hand Value: " + dealerHand.value + " - Draw!";
    showPlayAgain();
};
let deck = new Deck();
deck.shuffle();
let playerHand = new Hand(deck.cards.pop(), deck.cards.pop(), false);
console.log("Player hand value: " + playerHand.value);
console.log(playerHand);
let dealerHand = new Hand(deck.cards.pop(), deck.cards.pop(), true);
console.log("Dealer hand value: " + dealerHand.value);
console.log(dealerHand);
document.getElementById("hitButton").addEventListener("click", () => {
    playerHand.addCard(deck.cards.pop());
    if (playerHand.hasBust) {
        dealerHand.showSecondCard();
        dealerWins(dealerHand);
    }
});
document.getElementById("standButton").addEventListener("click", () => {
    let hitButton = (document.getElementById("hitButton"));
    hitButton.disabled = true;
    dealerDraw(playerHand, dealerHand, deck);
    if (dealerHand.hasBust) {
        playerWins(dealerHand);
    }
    else {
        if (dealerHand.value > playerHand.value) {
            dealerWins(dealerHand);
        }
        else if (dealerHand.value < playerHand.value) {
            playerWins(dealerHand);
        }
        else {
            draw(dealerHand);
        }
    }
});
document.getElementById("playAgainButton").addEventListener("click", () => {
    location.reload();
});
// Created by Parker Landon in JavaScript, 5/3/2020
// Recreated by Parker Landon in TypeScript, 1/11/2021
