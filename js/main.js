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

	getPower: function() {
		return data.power;
	},


/* Get functions - Get data from data object
===========================================================================*/

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
		console.log("User Moves: " + data.userMoves);
		console.log("--------------------------------");
		var userMoves = controller.getUserMoves();
		var computerMoves = controller.getComputerMoves();
		// If the user's move doesn't match the computer's, flash "X".
		if (userMoves[index] !== computerMoves[index]) {
			controller.updateUserMoves("reset");
			view.userCantChoose();
			view.flashWrongChoice();
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
  			$('.count-text').fadeOut(150);
    		$('.count-text').fadeIn(150);
    		// When the flashing is over, clear the interval and have the computer start its first move.
  		    if(counter === 3) {
  		        clearInterval(interval);
  		        controller.updateWhoseTurn("user");
  		        view.flashComputerMoves();
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
		$(".count-text").html("--");
		$(".count").removeClass("on");
		$(".start .btn-custom").off("click");
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
		setTimeout(function(){$("." + button).removeClass(flashColorClass);}, 1000);
	},

	renderScore: function() {
		var currentScore = controller.getScore();
		$(".count-text").html(currentScore);
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