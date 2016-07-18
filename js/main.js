/* Data 
==================================================*/
var data = {
	// "on" or "off"
	power: "off",

	// "computer" or "user"
	whoseTurn: "computer",

	computerMoves: [],

	userMoves: [],

};



/* Controller 
==================================================*/
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

	getPower: function() {
		return data.power;
	},

	computerMove: function() {
		var color = controller.chooseRandomColor();
		controller.addColor(color);
		view.flashComputerMoves();
	},

	addColor: function(color) {
		if (controller.getWhoseTurn() === "computer") {
			data.computerMoves.push(color);
		} else {
			data.userMoves.push(color);
		}
	},

	getWhoseTurn: function() {
		return data.whoseTurn;
	},

	chooseRandomColor: function() {
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

	getComputerMoves: function() {
		return data.computerMoves;
	},


	getFlashColor: function(move) {
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
};


/* View 
==================================================*/
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

	// Counter flashes
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
		// var moves = controller.getComputerMoves();
		// var flashMovesList = controller.createFlashMovesList();
		// function flashTheColor(flashColor) {
		// 	setTimeout(function() { console.log(flashColor); }, 2000);
		// }

		// for (var i = 0; i < moves.length; i++) {
		// 	// flash color or moves[i];
		// 	// console.log(controller.getFlashColor(moves[i]));
		// 	var flashColor = controller.getFlashColor(moves[i]);
		// 	// $("." + moves[i]).addClass(flashColor);
		// 	flashTheColor(flashColor);

		// }

		// function doSetTimeout(i) {
		//   setTimeout(function() { alert(i); }, 100);
		// }

		// for (var i = 1; i <= 2; ++i)
		//   doSetTimeout(i);
		//setInterval(function(){ console.log(i); }, 500);

		//var list = Array(...);

		var moves = controller.getComputerMoves();
		

		var integer = 0;
		var flashColor = '';
		var i = setInterval(function(){
		    // do your thing
		    flashColor = controller.getFlashColor(moves[integer]);
		    console.log(flashColor);
		    integer++;
		    if(integer === moves.length) {
		        clearInterval(i);
		    }
		}, 1000);
	}
};

controller.init();