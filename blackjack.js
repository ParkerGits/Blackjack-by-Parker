const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["D", "S", "C", "H"];
const CARD_WIDTH = 150;
const CARD_HEIGHT = 230;
class Card
{
  constructor(rank, suit)
  {
    this.rank = rank;
    this.suit = suit;
  }
  get string()
  {
    return this.rank + this.suit;
  }
  get value()
  {
    if(this.rank == "2" || this.rank == "3" || this.rank == "4" || this.rank == "5" || this.rank == "6" || this.rank == "7" || this.rank == "8" || this.rank == "9")
    {
      return parseInt(this.rank);
    }
    else if (this.rank == "10" || this.rank == "J" || this.rank == "Q" || this.rank == "K")
    {
      return 10;
    }
    else if (this.rank == "A")
    {
      return "A"
    }
  }
}

class Deck
{
  constructor()
  {
    this.cards = [];
    for(let i = 0; i<RANKS.length; i++)
    {
      for(let j = 0; j<SUITS.length; j++)
      {
          this.cards.push(new Card(RANKS[i], SUITS[j]));
      }
    }
  }
  shuffle()
  {
    let orderOfCards = [];
    for(let i = 0; i<52; i++)
    {
      orderOfCards.push(i);
    }
    while(orderOfCards.length>0)
    {
      let firstIndex = Math.floor(Math.random() * orderOfCards.length);
      let firstCard = orderOfCards.splice(firstIndex, 1);
      let secondIndex = Math.floor(Math.random() * orderOfCards.length);
      let secondCard = orderOfCards.splice(secondIndex, 1);
      let temp = this.cards[firstCard];
      this.cards[firstCard] = this.cards[secondCard];
      this.cards[secondCard] = temp;
    }
  }
  print()
  {
    for(let i = 0; i < this.cards.length; i++)
    {
      console.log(this.cards[i].toString());
    }
  }
}

class Hand
{
   constructor(cardOne, cardTwo, isDealer)
   {
     this.cards = [cardOne, cardTwo];
     this.isDealer = isDealer;
     this.hasBust = false;
     if(this.isDealer)
     {
       this.visualHand = document.getElementById("dealerHand");
     }
     else
     {
       this.visualHand = document.getElementById("playerHand");
       document.getElementById('playerHandValue').innerHTML = "Soft Hand Value: " + this.value;
     }
     let visualCardOne = document.createElement("li");
     let visualCardTwo = document.createElement("li");
     let cardOnePicture = document.createElement("img");
     let cardTwoPicture = document.createElement("img");
     cardOnePicture.src = "img/" + cardOne.string + ".png";
     cardOnePicture.width = "150";
     cardOnePicture.height = "230";
     visualCardOne.appendChild(cardOnePicture);
     if(this.isDealer)
     {
        cardTwoPicture.src = "img/red_back.png";
        cardTwoPicture.id = "hiddenCard";
     }
     else
     {
        cardTwoPicture.src = "img/" + cardTwo.string + ".png";
     }
     cardTwoPicture.width = "150";
     cardTwoPicture.height = "230";
     visualCardTwo.appendChild(cardTwoPicture);
     this.visualHand.appendChild(visualCardOne);
     this.visualHand.appendChild(visualCardTwo);
   }
   addCard(card)
   {
     if(this.value <= 21)
     {
       this.cards.push(card);
       console.log(this.cards);
       let visualNewCard = document.createElement("li");
       let newCardPicture = document.createElement("img");
       newCardPicture.src = "img/" + card.string + ".png";
       newCardPicture.width = "150";
       newCardPicture.height = "230";
       visualNewCard.appendChild(newCardPicture);
       this.visualHand.appendChild(visualNewCard);
       if(this.value <= 21 && !this.isDealer)
       {
         document.getElementById("playerHandValue").innerHTML = "Soft Hand Value: " + this.value;
       }
       else if (this.value > 21 && !this.isDealer)
       {
         document.getElementById("playerHandValue").innerHTML = "BUST!";
         this.hasBust = true;
         document.getElementById("hitButton").disabled = true;
         document.getElementById("standButton").disabled = true;
       }
     }
   }
   showSecondCard()
   {
     document.getElementById("hiddenCard").src = "img/" + this.cards[1].string + ".png";
   }
   get value()
   {
     let aceCount = 0;
     let valueSum = 0;
     for(let i = 0; i < this.cards.length; i++)
     {
       if(this.cards[i].value == "A")
       {
         aceCount++
       }
       else
       {
         valueSum += this.cards[i].value;
       }
     }
     for(let i = 0; i<aceCount; i++)
     {
       if(valueSum > 10)
       {
         valueSum += 1;
       }
       else
       {
         valueSum += 11;
       }
     }
     return valueSum;
   }
}

let dealerDraw = (playerHand, dealerHand, deck) =>
{
  dealerHand.showSecondCard();
  while(dealerHand.value < playerHand.value && dealerHand.value <= 21)
  {
    dealerHand.addCard(deck.cards.pop());
  }
  if(dealerHand.value > 21)
  {
    dealerHand.hasBust = true;
  }
}

let showPlayAgain = () =>
{
  document.getElementById("playAgainButton").style.display =  "inline";
}

let dealerWins = (playerHand, dealerHand) =>
{
  document.getElementById("winnerText").innerHTML = "Dealer Hand Value: " + dealerHand.value + " - Dealer Wins!"
  showPlayAgain();
}

let playerWins = (playerHand, dealerHand) =>
{
  if(dealerHand.hasBust)
  {
    document.getElementById("winnerText").innerHTML = "Dealer Busts! - Player Wins!"
  }
  else
  {
    document.getElementById("winnerText").innerHTML = "Dealer Hand Value: " + dealerHand.value + " - Player Wins!"
  }
  showPlayAgain();
}

let draw = (playerHand, dealerHand) =>
{
  document.getElementById("winnerText").innerHTML = "Dealer Hand Value: " + dealerHand.value + " - Draw!";
  showPlayAgain();
}
let deck = new Deck();
deck.shuffle();
let playerHand = new Hand(deck.cards.pop(), deck.cards.pop(), false);
console.log("Player hand value: " + playerHand.value);
console.log(playerHand)
let dealerHand = new Hand(deck.cards.pop(), deck.cards.pop(), true);
console.log("Dealer hand value: " + dealerHand.value);
console.log(dealerHand);
document.getElementById("hitButton").addEventListener("click", function(){
  playerHand.addCard(deck.cards.pop());
  if(playerHand.hasBust)
  {
    dealerHand.showSecondCard();
    dealerWins(playerHand, dealerHand);
  }
});
document.getElementById("standButton").addEventListener("click", function(){
  document.getElementById("hitButton").disabled = true;
  dealerDraw(playerHand, dealerHand, deck);
  if(dealerHand.hasBust)
  {
    playerWins(playerHand, dealerHand);
  }
  else {
    if(dealerHand.value > playerHand.value)
    {
      dealerWins(playerHand, dealerHand);
    }
    else if (dealerHand.value < playerHand.value)
    {
      playerWins(playerHand, dealerHand);
    }
    else
    {
      draw(playerHand, dealerHand);
    }
  }
});
document.getElementById("playAgainButton").addEventListener("click", function(){
  location.reload();
})
