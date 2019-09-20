/* 
	Basklass.
	- initiering av icon-dice-knappen
*/
var Main = {
	init : function() {
		document.getElementById("icon-dice").addEventListener("click",function() {
			var app = new Application();
			app.openApp();
		});
	}
};
window.addEventListener("load",Main.init);