/* Data 
====================================================================================================
====================================================================================================*/
var data = {

	// "on" or "off"
	power: "off",

	// "computer" or "user"
	whoseTurn: "computer",

	computerMoves: [],

	userMoves: [],

}; // End of data




/* Controller 
====================================================================================================
====================================================================================================*/
var controller = {

	init: function() {
		view.init();
	},


	updatePower: function(offOrOn) {
		data.power = offOrOn;
	},

	updateWhoseTurn: function(whoseTurn) {
		view.whoseTurn = whoseTurn;
	},

	updateMoves: function(move) {
		if (move === "reset") {
			data.computerMoves = [];
			data.userMoves = [];
		} else if (controller.getWhoseTurn() === "computer") {
			data.computerMoves.push(move);
		} else if (controller.getWhoseTurn() === "user") {
			data.userMoves.push(move);
		}
	},


	getPower: function() {
		return data.power;
	},

	getWhoseTurn: function() {
		return data.whoseTurn;
	},

	getComputerMoves: function() {
		return data.computerMoves;
	},


	computerMove: function() {
		var move = controller.chooseRandomMove();
		controller.updateMoves(move);
		view.flashComputerMoves();
	},

	chooseRandomMove: function() {
		var num = Math.floor((Math.random() * 4) + 1);
		switch(num) {
			case 1:
				return "top-left";
			case 2:
				return "top-right";
			case 3:
				return "bottom-left";
			case 4:
				return "bottom-right";
		}
	},

	chooseFlashColor: function(move) {
		switch(move) {
			case "top-left":
				return "bright-green";
			case "top-right":
				return "bright-red";
			case "bottom-left":
				return "bright-yellow";
			case "bottom-right":
				return "bright-blue";
		}
	},

	resetGame: function() {
		controller.updateMoves("reset");
		controller.updateWhoseTurn("computer");
	}
}; // End of controller




/* View 
====================================================================================================
====================================================================================================*/
var view = {

	init: function() {
		view.powerButtonClickHandler();
	},

	powerButtonClickHandler: function() {
		$(".power .btn-custom").on("click", function() {
			if (controller.getPower() === "off") {
				controller.updatePower("on");
				view.powerOn();
			} else {
				controller.updatePower("off");
				view.powerOff();	
			}
		});
	},

	startButtonClickHandler: function() {
		$(".start .btn-custom").on("click", function() {
			controller.resetGame();
			view.flashStart();
		});
	},

	// Counter flashes when start button is clicked
	flashStart: function() {
  		var counter = 1;
  		start();
  		var interval = setInterval(function() {
  			start();
  		}, 400);
  		function start() {
  			$('.count-text').fadeOut(150);
    		$('.count-text').fadeIn(150);
    		// When the flashing is over, clear the interval and have the computer start its first move.
  		    if(counter === 3) {
  		        clearInterval(interval);
  		        controller.computerMove();
  		    } else {
  		        counter++;
  		    }
  		}
	},

	powerOn: function() {
		$(".count").addClass("on");	
		view.startButtonClickHandler();
	},

	powerOff: function() {
		$(".count").removeClass("on");
		$(".start .btn-custom").off("click");
	},

	flashComputerMoves: function() {
		var moves = controller.getComputerMoves();
		var integer = 0;
		var flashColor = '';
		var timeInterval = setInterval(function(){
		    var button = moves[integer];
			var flashColorClass = controller.chooseFlashColor(moves[integer]);
		    $("." + button).addClass(flashColorClass);
		    view.singleFlash(button, flashColorClass);
		    integer++;
		    if(integer === moves.length) {
		        clearInterval(timeInterval);
		    }
		}, 1500);
	},

	singleFlash: function(button, flashColorClass) {
		setTimeout(function(){$("." + button).removeClass(flashColorClass);}, 1000);
	}
}; // End of view

controller.init();