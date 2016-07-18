/* Data 
==================================================*/
var data = {
	// "on" or "off"
	power: "off",

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
	}

};

controller.init();