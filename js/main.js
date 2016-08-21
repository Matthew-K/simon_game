/* Data 
====================================================================================================
====================================================================================================*/
var data = {

	// "on" or "off"
	power: "off",

	// "on" or "off"
	strict: "off",

	// "computer" or "user"
	whoseTurn: "computer",

	computerMoves: [],

	userMoves: [],

	score: 0

}; // End of data



/* Controller 
====================================================================================================
====================================================================================================*/
var controller = {

	init: function() {
		view.init();
	},

	// Called when user clicks start button
	resetGame: function() {
		controller.updateComputerMoves("reset");
		controller.updateUserMoves("reset");
		controller.updateWhoseTurn("computer");
		controller.updateScore(0);
		view.userCantChoose();
	},


/* Update functions - Update data in data object
===========================================================================*/

	updatePower: function(offOrOn) {
		data.power = offOrOn;
	},

	updateStrict: function(offorOn) {
		data.strict = offorOn;
		view.renderStrictLight();
	},

	updateWhoseTurn: function(whoseTurn) {
		data.whoseTurn = whoseTurn;
	},

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

	updateScore: function(num) {
		data.score = num;
	},


/* Get functions - Get data from data object
===========================================================================*/

	getPower: function() {
		return data.power;
	},

	getStrict: function() {
		return data.strict;
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

	getScore: function() {
		return data.score;
	},


/* Functions used during computer's moves
===========================================================================*/

	computerMove: function() {
		var move = controller.chooseRandomMove();
		controller.updateComputerMoves(move);
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

	// Matches a move with its proper class
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


/* Functions used during user's moves
===========================================================================*/

	userMove: function() {
		if(controller.getPower() === "off") {
			return;
		}
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
		if(controller.getPower() === "off") {
			return;
		}
		controller.updateUserMoves(move);
		console.log("User Moves: " + data.userMoves);
		console.log("--------------------------------");
		var userMoves = controller.getUserMoves();
		var computerMoves = controller.getComputerMoves();
		// If the user's move doesn't match the computer's, flash "X".
		if (userMoves[index] !== computerMoves[index]) {
			if (controller.getStrict() === "on") {
				console.log("Strict is on");
				controller.resetGame();
				view.flashWrongChoice();
			} else {
				controller.updateUserMoves("reset");
				view.userCantChoose();
				view.flashWrongChoice();
			}
		// If the user has matched all the moves, update the score and have the computer add another move.
		} else if (controller.getUserMoves().length === controller.getComputerMoves().length) {
			controller.updateWhoseTurn("computer");
			view.userCantChoose();
			controller.updateScore(controller.getScore() + 1);
			controller.computerMove();
		}
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

	strictButtonClickHandler: function() {
		$(".strict .btn-custom").on("click", function() {
			if (controller.getStrict() === "off") {
				controller.updateStrict("on");
			} else {
				controller.updateStrict("off");
			}
		});
	},

	renderStrictLight: function() {
		if (controller.getStrict() === "on") {
			$(".strict .light").css("background", "#d32f2f");
		} else if (controller.getStrict() === "off") {
			$(".strict .light").css("background", "#1a1a1a");
		}
	},

	// Counter flashes when start button is clicked
	flashStart: function() {
  		controller.updateScore(1);
  		var counter = 1;
  		$(".count-text").html("--");
  		start();
  		var interval = setInterval(function() {
  			start();
  		}, 400);
  		function start() {
  			if(controller.getPower() === "off") {
  				clearInterval(interval);
  				return;
  			}
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

	// Counter flashes "X" when user guesses wrong. Afterwards, have computer repeat it's moves
	flashWrongChoice: function() {
  		var counter = 1;
  		$(".count-text").html("X");
  		start();
  		var interval = setInterval(function() {
  			start();
  		}, 400);
  		function start() {
  			if(controller.getPower() === "off") {
  				clearInterval(interval);
  				return;
  			}
  			$('.count-text').fadeOut(150);
    		$('.count-text').fadeIn(150);
    		// When the flashing is over, clear the interval and have the computer start its first move.
  		    if(counter === 3) {
  		        clearInterval(interval);
  		        controller.updateWhoseTurn("user");
  		        if (controller.getStrict() === "on") {
  		        	controller.updateScore(1);
  		        	controller.computerMove();
  		        }
  		        else {
  		        	view.flashComputerMoves();
  		        }
  		    } else {
  		        counter++;
  		    }
  		}
	},

	powerOn: function() {
		$(".count").addClass("on");	
		view.startButtonClickHandler();
		view.strictButtonClickHandler();
	},

	powerOff: function() {
		controller.resetGame();
		$(".count-text").html("--");
		$(".count").removeClass("on");
		$(".start .btn-custom").off("click");
		$(".strict .btn-custom").off("click");
		controller.updateStrict('off');
		view.renderStrictLight();
		view.userCantChoose();
		view.removeBrightColorClasses();
	},

	// Have the computer flash it's moves
	flashComputerMoves: function() {
		var moves = controller.getComputerMoves();
		view.renderScore();
		console.log("Computer Moves: " + moves);
		console.log("--------------------------------");
		var integer = 0;
		var flashColor = '';
		var timeInterval = setInterval(function(){
			if(controller.getPower() === "off") {
				clearInterval(timeInterval);
				return;
			}
		    var button = moves[integer];
			var flashColorClass = controller.chooseFlashColor(moves[integer]);
		    $("." + button).addClass(flashColorClass);
		    view.singleFlash(button, flashColorClass);
		    integer++;
		    // Have user repeat the moves once they are all shown.
		    if(integer === moves.length) {
		        clearInterval(timeInterval);
		        controller.userMove();
		    }
		}, 1500);
	},

	singleFlash: function(button, flashColorClass) {
		if(controller.getPower() === "off") {
			return;
		}
		setTimeout(function(){$("." + button).removeClass(flashColorClass);}, 1000);
	},

	renderScore: function() {
		var currentScore = controller.getScore();
		$(".count-text").html(currentScore);
	},

	removeBrightColorClasses: function() {
		$(".top-left").removeClass("bright-green");
		$(".top-right").removeClass("bright-red");
		$(".bottom-left").removeClass("bright-yellow");
		$(".bottom-right").removeClass("bright-blue");
	},

/* Functions related to letting or denying the user the right to pick moves
===========================================================================*/

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



// Initialize at beginning
controller.init();