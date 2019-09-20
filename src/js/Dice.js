/*
	Enskilda tärningars egenskaper och metoder
*/
function Dice() {
	this.value = 1;
}

/* 
	Metod för att returnera ett tärningselement
	- skapar ett li-element med ett slumpat värde mellan 1-6 som returneras
*/
Dice.prototype.createDice = function() {
	this.dice = document.createElement("li");
	this.dice.value = this.roll();
	return this.dice;
};

/*
	Metod för att returnera ett slumptal mellan 1-6
	- använder metod från Mozilla för att få ett värde med lika stor chans till en 1a som 6a
*/
Dice.prototype.roll = function() {
	this.min = Math.ceil(1);
	this.max = Math.floor(6);
	return Math.floor(Math.random() * (this.max-this.min+1) + this.min);
};

