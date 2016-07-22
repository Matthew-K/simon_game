/* Data 
====================================================================================================
====================================================================================================*/
var data = {

	// "on" or "off"
	power: "off",

	// "computer" or "user"
	whoseTurn: "computer",

	computerMoves: ["top-left", "top-right", "bottom-left", "bottom-right"],

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
		data.whoseTurn = whoseTurn;
	},

	// updateMoves: function(move) {
	// 	if (move === "reset") {
	// 		data.computerMoves = [];
	// 		data.userMoves = [];
	// 	} else if (controller.getWhoseTurn() === "computer") {
	// 		data.computerMoves.push(move);
	// 	} else if (controller.getWhoseTurn() === "user") {
	// 		data.userMoves.push(move);
	// 	}
	// },

	updateComputerMoves: function(move) {
		if (move === "reset") {
			data.computerMoves = [];
		} else {
			data.computerMoves.push(move);
		}
	},

	updateUserMoves: function(move) {
		if (move === "reset") {
			data.userMoves = [];
		} else {
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

	getUserMoves: function() {
		return data.userMoves;
	},


	computerMove: function() {
		var move = controller.chooseRandomMove();
		controller.updateComputerMoves(move);
		view.flashComputerMoves();
	},

	userMove: function() {
		controller.updateWhoseTurn("user");
		console.log("function controller.userMove called");
		controller.updateUserMoves("reset");
		view.addPointerClasses();
		view.addActiveClasses();
		controller.currentMove();
	},

	currentMove: function() {
		$(".top-left").on("click", function() {
			var index = controller.getUserMoves().length;
			controller.updateAndCheckUserMove("top-left", index);
		});
		$(".top-right").on("click", function() {
			var index = controller.getUserMoves().length;
			controller.updateAndCheckUserMove("top-right", index);
		});
		$(".bottom-left").on("click", function() {
			var index = controller.getUserMoves().length;
			controller.updateAndCheckUserMove("bottom-left", index);
		});
		$(".bottom-right").on("click", function() {
			var index = controller.getUserMoves().length;
			controller.updateAndCheckUserMove("bottom-right", index);
		});
	},

	updateAndCheckUserMove: function(move, index) {
		controller.updateUserMoves(move);
		var userMoves = controller.getUserMoves();
		var computerMoves = controller.getComputerMoves();
		console.log("===========");
		console.log(userMoves[index]);
		console.log(computerMoves[index]);
		if (userMoves[index] !== computerMoves[index]) {
			controller.updateUserMoves("reset");
			view.userCantChoose();
			view.flashComputerMoves();
		}
		if (controller.getUserMoves().length === controller.getComputerMoves().length) {
			controller.updateWhoseTurn("computer");
			view.userCantChoose();
			console.log("equal lengths");
			controller.computerMove();
		}

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
		controller.updateComputerMoves("reset");
		controller.updateUserMoves("reset");
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
		console.log(moves);
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
		        controller.userMove();
		    }
		}, 1500);
	},

	singleFlash: function(button, flashColorClass) {
		setTimeout(function(){$("." + button).removeClass(flashColorClass);}, 1000);
	},

	addPointerClasses: function() {
		$(".color-choice").addClass("pointer");
	},

	addActiveClasses: function() {
		$(".top-left").addClass("active-green");
		$(".top-right").addClass("active-red");
		$(".bottom-left").addClass("active-yellow");
		$(".bottom-right").addClass("active-blue");
	},

	userCantChoose: function() {
		view.removeColorChoiceClickHandlers();
		view.removeActiveClasses();
		view.removePointerClasses();
	},

	removeColorChoiceClickHandlers: function() {
		$(".color-choice").off("click");
	},

	removeActiveClasses: function() {
		$(".top-left").removeClass("active-green");
		$(".top-right").removeClass("active-red");
		$(".bottom-left").removeClass("active-yellow");
		$(".bottom-right").removeClass("active-blue");
	},

	removePointerClasses: function() {
		$(".color-choice").removeClass("pointer");
	}
}; // End of view

controller.init();