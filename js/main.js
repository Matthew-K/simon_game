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
		console.log(data.power);
	},

	getPower: function() {
		return data.power;
	}


};


/* View 
==================================================*/
var view = {

	init: function() {
		view.powerButton();
	},

	powerButton: function() {
		$(".power").on("click", function() {
			if (controller.getPower() === "off") {
				controller.updatePower("on");
				$(".count").addClass("on");	
			} else {
				controller.updatePower("off");
				$(".count").removeClass("on");	
			}
		});
	}

};

controller.init();