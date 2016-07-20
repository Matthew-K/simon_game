/* Data 
====================================================================================================
====================================================================================================*/
var data = {

	// "on" or "off"
	power: "off",

	// "computer" or "user"
	whoseTurn: "computer",

	start: '',

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

	updateStart: function() {
		data.start = "start";
	},

	updateMoves: function(move) {
		if (controller.getWhoseTurn() === "computer") {
			data.computerMoves.push(move);
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
			controller.updateStart();
			view.flashStart();
		});
	},

	// Counter flashes when start button is clicked
	flashStart: function() {
  		var counter = 1;
  		var interval = setInterval(function() {
  			start();
  		});
  		function start() {
  			$('.count-text').fadeOut(150);
    		$('.count-text').fadeIn(150);
  		    if(counter == 3) {
  		        clearInterval(interval);
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
		window.setTimeout(function(){$("." + button).removeClass(flashColorClass);}, 1000);
	}
}; // End of view

controller.init();