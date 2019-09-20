/*
	Ett programfönster innehållandes tärningsapplikationens funktionalitet
*/
function Application() {
	this.windowElem = null; // applikationens fönster
	this.dicesUl = null; // ul-elementet där tärningar ska fästas
	this.counterWrapper = null; // ul-elementet till räknaren
	
	this.dices = []; // array med tärningarna
	
	this.isDown = false; // kontroll för om musen är nedtryckt, används för drag and drop
	this.offset = [0,0]; // array innehållandes två värden som används vid drag and drop
}

/* 
	Metod för att skapa element med eventuellt classname, returnerar ett element
*/
Application.prototype.createElem = function(type,classname) {
	var elem = document.createElement(type);
	if (classname) {
		elem.className = classname;
	}
	return elem;
};

/*
	Metod för att skapa de olika elementen som finns i tärningsapplikationens fönster
	- använder metoden createElem för att skapa nytt element med classname
*/
Application.prototype.openApp = function() {
	var pageContentWrapper = document.getElementById("page-content-wrapper");
	
	var diceWindowWrapper = this.createElem("div","dice-window-wrapper");
		pageContentWrapper.appendChild(diceWindowWrapper);
	
	var diceMenubarWrapper = this.createElem("div","dice-menubar-wrapper");
		diceWindowWrapper.appendChild(diceMenubarWrapper);
	
		diceMenubarWrapper.addEventListener("mousedown",this.mouseDown.bind(this));
		diceMenubarWrapper.addEventListener("mouseup",this.mouseUp.bind(this));
	
	var diceMenubarClose = this.createElem("div","close");
		diceMenubarWrapper.appendChild(diceMenubarClose);
		diceMenubarClose.addEventListener("click",this.closeApp.bind(this));
	
	var diceToolbarWrapper = this.createElem("div","dice-toolbar-wrapper");
		diceWindowWrapper.appendChild(diceToolbarWrapper);
	
	var diceToolbarUl = this.createElem("ul","dice-toolbar-wrapper");
		diceToolbarWrapper.appendChild(diceToolbarUl);

	// DICE-ACTIONS
	var diceToolbarAdd = this.createElem("li","add");
		diceToolbarUl.appendChild(diceToolbarAdd);
		diceToolbarAdd.addEventListener("click",this.addDice.bind(this));
	
	var diceToolbarRemove = this.createElem("li","remove");
		diceToolbarUl.appendChild(diceToolbarRemove);
		diceToolbarRemove.addEventListener("click",this.removeDice.bind(this));
	
	var diceToolbarRoll = this.createElem("li","roll");
		diceToolbarUl.appendChild(diceToolbarRoll);
		diceToolbarRoll.addEventListener("click",this.shuffleDices.bind(this));
	
	// COUNTER
	var diceToolbarLi = this.createElem("li");
		diceToolbarUl.appendChild(diceToolbarLi);

	var diceToolbarCounterWrapper = this.createElem("ul","dice-toolbar-counter-wrapper");
		diceToolbarLi.appendChild(diceToolbarCounterWrapper);
	
	var diceToolbarCounterFifth = this.createElem("li","zero");
		diceToolbarCounterWrapper.appendChild(diceToolbarCounterFifth);
	
	var diceToolbarCounterFourth = this.createElem("li","zero");
		diceToolbarCounterWrapper.appendChild(diceToolbarCounterFourth);
	
	var diceToolbarCounterThird = this.createElem("li","zero");
		diceToolbarCounterWrapper.appendChild(diceToolbarCounterThird);
	
	var diceToolbarCounterSecond = this.createElem("li","zero");
		diceToolbarCounterWrapper.appendChild(diceToolbarCounterSecond);
	
	var diceToolbarCounterFirst = this.createElem("li","zero");
		diceToolbarCounterWrapper.appendChild(diceToolbarCounterFirst);
		
	//DICES GOES HERE
	var diceContentWrapper = this.createElem("div","dice-content-wrapper");
		diceWindowWrapper.appendChild(diceContentWrapper);
	
	var diceContentUl = this.createElem("ul");
		diceContentWrapper.appendChild(diceContentUl);
	
	//CLASS-GLOBAL VARIABLES 
	this.windowElem = diceWindowWrapper; // Tärningsapplikationens fönster
	this.dicesUl = diceContentUl; // Ul-lista där tärningarna läggs in
	this.counterWrapper = diceToolbarCounterWrapper; // Ul-lista innehållandes counter-elementen
};

/* 
	Metod för att stänga programfönstret
*/
Application.prototype.closeApp = function() {
	this.windowElem.parentNode.removeChild(this.windowElem);
};

/*
	Metod för att lägga till en tärning
	- playSound anropas för ljud
	- nytt tärningsobjekt skapas
	- classname hämtas genom att byta ut det i switchNr
	- tärningen läggs in i arrayen dices
	- count anropas för en ny beräkning
*/
Application.prototype.addDice = function() {
	if (this.dices.length < 40) {
		this.playSound();
		
		var d = new Dice();
		var dice = d.createDice();
		dice.className = "dice dice-side-" + this.switchNr(dice.value);
		this.dicesUl.appendChild(dice);
		this.dices.push(dice);
		
		this.counter();
	}
};

/* 
	Metod för att ta bort senast inlagda tärning
	- playSound anropas för ljud
	- sista inlagda li-elementet i ul-listan tas bort
	- sista inlagda tärningen i arrayen dices tas bort
	- count anropas för en ny beräkning
*/
Application.prototype.removeDice = function() {
	if (this.dices.length>0) {
		this.playSound();
		
		this.dicesUl.removeChild(this.dicesUl.lastChild);
		this.dices.splice(-1,1);
		
		this.counter();
	}
};

/*
	Metod för att kasta om tärningarna
	- om det finns li-element tas de bort och addDice anropas för att lägga till en ny
*/
Application.prototype.shuffleDices = function() {
	var dicesToShuffle = this.dicesUl.querySelectorAll("li");
	if (dicesToShuffle.length>0) {
		for (var i=0;i<dicesToShuffle.length;i++) {
			this.dices.splice(-1,1);
			dicesToShuffle[i].parentNode.removeChild(dicesToShuffle[i]);
			this.addDice();
		}
	}
};

/*
	Metod för att lägga in ett ljud
	- när metoden anropas spelas ljudet upp
*/
Application.prototype.playSound = function() {
	var sound = new Audio("src/wav/add.wav");
		sound.play();
};

/* 
	Metod för räknare
	- sparar alla tärningars värden och skriver om den till 5 siffrigt värde
	- ger li-elementen nya classnames beroende på värdet
*/
Application.prototype.counter = function() {
	var sum = 0;
	for (var i=0;i<this.dices.length;i++) {
		sum += this.dices[i].value;
	}
	var num = ("00000" + sum).slice(-5);
	
	var li = this.counterWrapper.querySelectorAll("li");
	
	for (var y=0;y<li.length;y++) {
		for (var i in num) {
			var n = Number(num[i]);
			li[i].className = this.switchNr(n);
		}
	}
};

/*
	Metod för att returnera rätt classname till counter och addDice
*/
Application.prototype.switchNr = function(switchthis) {
	switch (switchthis) {
		case 0: return "zero";
		case 1: return "one";
		case 2: return "two";
		case 3: return "three";
		case 4: return "four";
		case 5: return "five";
		case 6: return "six";
		case 7: return "seven";
		case 8: return "eight";
		case 9: return "nine";
		}
};

/* 
	Metod för att hantera händelselyssnaren "mousedown".
	- Tar reda på musens offset
	- Sätter isDown till true så koden i mouseMove kan aktiveras
	- Fäster händelselyssnare på window för att kunna flytta div'en
*/
Application.prototype.mouseDown = function(ev) {
	this.isDown = true;
	this.offset = [
		ev.clientX - this.windowElem.offsetLeft,
		ev.clientY - this.windowElem.offsetTop
	];
	
	window.addEventListener("mousemove",this.mouseMove.bind(this));
};

/*
	Metod för att hantera händelselyssnaren "mousemove"
	- Ändrar div'ens position till absolut
	- Ändrar z-index med hjälp av kod från Henrik Andersen
	- Ändrar div'ens top och left position
*/
Application.prototype.mouseMove = function(e) {
	if (this.isDown) {
		this.windowElem.style.position = "absolute";
		this.windowElem.style.zIndex = Math.floor(new Date().getTime()/1000);
		this.windowElem.style.left = e.clientX - this.offset[0] + "px";
		this.windowElem.style.top = e.clientY - this.offset[1] + "px";
	}
};

/*
	Metod för att hantera händelselyssnaren "mouseup"
	- Sätter isDown till false så koden i mouseMove inaktiveras
*/
Application.prototype.mouseUp = function() {
	this.isDown = false;
};