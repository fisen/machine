/**
 * This class is controlling the drag and drop function.
 */

$(document).ready(function () {

	var gm = new GearMachine();

	var figures = new Array();
	var toolFigures = new Array();


	var canvas = null;
	var ctx = null;
	var toolCanvas = null;
	var toolCtx = null;
	var currentCanvas = null;
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var dragok = false;
	var currentFigure = null;
	var startX = 0, startY = 0;
	var movingCogWheel = false;
	var gearsArray = new Array();
	var nbrGears = 0;
    var scale = 1;
	
	//Used for map panning
    var panningOk = false;
	var startCoords = [];
	var lastCoords = [0, 0];
	

	/**
	 * Initializes the canvases with some test gears.
	 */
	function init() {
		canvas = (document.getElementById("canvas"));
		ctx = canvas.getContext("2d");
		ctx.canvas.width  = WIDTH;
		ctx.canvas.height = HEIGHT - 100;

		toolCanvas = (document.getElementById("toolbox-canvas"));
		toolCtx = toolCanvas.getContext("2d");
		toolCtx.canvas.width  = window.innerWidth;
		toolCtx.canvas.height = 80;

		addToolboxGear(new Gear(0, 0, 0, "#0000CC", 1, 13, 36, 31, 0, 9, 15));
		addToolboxGear(new Gear(0, 0, 0, "#FF0000", 1, 13, 31, 26, 0, 9, 13));
		addToolboxGear(new Gear(0, 0, 0, "#00CC00", 1, 13, 26, 21, 0, 9, 11));
		setInterval(draw, 50);
	}

	/**
	 * Clears both canvases
	 */
	function clear() {
		// Store the current transformation matrix
		ctx.save();

		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		toolCtx.clearRect(0, 0, toolCanvas.width, toolCanvas.height);

		// Restore the transform
		ctx.restore();
	}

	/**
	 * Draw the canvas. This method is called every 100 ms when the user presses the mouse.
	 */
	function draw() {
		clear();
		for (var n=0; n < toolFigures.length; n++) {
			toolFigures[n].draw(toolCtx);
		}

		gm.step();
		gm.draw(ctx);

		if(currentFigure != null) {
			currentFigure.draw(currentCanvas.getContext("2d"));
		}
	}

	/**
	 * Changes the x and y value for the figure that is currently
	 * being dragged.
	 */
	function myMove(e) {
	    var x = e.offsetX;
	    var y = e.offsetY;
	    
		if (dragok && currentFigure != null){
			movingCogWheel = true;
			currentCanvas = e.target;
			currentFigure.setTransparency(0.5);
			currentFigure.setXPos(x - lastCoords[0]);
			currentFigure.setYPos(y - lastCoords[1]);
		} else if (dragok && gm.getGearAt(x, y) == null && panningOk) {
			//Dragging the workspace
			ctx.setTransform(scale, 0, 0, scale, x - startCoords[0], y - startCoords[1]);
		}
		ctx.save();	
	}

	/**
	 * Called when the user presses the mousebutton.
	 * Checks if a gear was pressed.
	 */
	function myDown(e) {

		currentCanvas = e.target;
		if($(currentCanvas).attr("id") == "canvas"){
			currentFigure = gm.getGearAt(e.pageX - $(canvas).offset().left, e.pageY - $(canvas).offset().top);
			if(currentFigure != null){
				if(!gm.active){
                    startX = currentFigure.getXPos();
                    startY = currentFigure.getYPos();
                    gm.removeGear(currentFigure);
				}
				else
					currentFigure = null;
			}
			else
				panningOk = true;
		}
		else {
			for (var n=0; n < toolFigures.length; n++) {
				if (e.pageX < toolFigures[n].getXPos() + toolFigures[n].getInnerRadius() + $(toolCanvas).offset().left &&
						e.pageX > toolFigures[n].getXPos() - toolFigures[n].getInnerRadius() + $(toolCanvas).offset().left &&
						e.pageY < toolFigures[n].getYPos() + toolFigures[n].getInnerRadius() + $(toolCanvas).offset().top &&
						e.pageY > toolFigures[n].getYPos() - toolFigures[n].getInnerRadius() + $(toolCanvas).offset().top) {
					currentFigure = clone(toolFigures[n]);
					break;
				}
			}
		}
		dragok = true;
		if (panningOk) {
		    startCoords = [
		                   e.offsetX - lastCoords[0],
		                   e.offsetY - lastCoords[1]
		                   ];
		}
		canvas.onmousemove = myMove;
		toolCanvas.onmousemove = myMove;
		
	}

	/**
	 * Called when the user releases the mouse button.
	 */
	function myUp(e){
		dragok = false;
		canvas.onmousemove = null;
		toolCanvas.onmousemove = null;
		if (panningOk) {
		    lastCoords = [
		                  e.offsetX - startCoords[0], // set last coordinates
		                  e.offsetY - startCoords[1]
		                  ];
		}
		
		ctx.save();
		
		if(currentFigure != null && $(e.target).attr("id") == "canvas"){
			currentFigure.setTransparency(1);
			try{
				gm.placeGear(currentFigure);
			}
			catch (err) {
				if(startX > 0){
					currentFigure.setXPos(startX);
					currentFigure.setYPos(startY);
					figures[figures.length] = currentFigure;
					startX = 0;
					startY = 0;
					
				}					
				console.log(err);
			}
		}
		currentFigure = null;
		panningOk = false;
		gm.printMatrix();
	}


	/**
	 * Adds a gear to the toolbox. The gears x and y values are modified to
	 * fit in the toolbox.
	 */
	function addToolboxGear(newGear){
		var previousGear = toolFigures[toolFigures.length - 1];
		if(previousGear != null)
			newGear.setXPos(previousGear.getXPos() + previousGear.getInnerRadius() + previousGear.getOuterRadius() + 35);
		else
			newGear.setXPos(50);
		newGear.setYPos(35);
		toolFigures[toolFigures.length] = newGear;
	}

	/**
	 * Returns an exact copy of gear.
	 */
	function clone(gear){
		return new Gear(nbrGears++, gear.getXPos(), gear.getYPos(), gear.getColor(), gear.getTransparency(),
				gear.getSides(), gear.getInnerRadius(), gear.getOuterRadius(), gear.getAngle(),
				gear.getHoleSides(), gear.getHoleRadius());
	}

	init();
	canvas.onmousedown = myDown;
	canvas.onmouseup = myUp;
	toolCanvas.onmousedown = myDown;
	toolCanvas.onmouseup = myUp;

	/**
	 * Controlling play/pause button.
	 */
	var isPlaying = false;	
	$("#play-pause").click(function() {
		if (!isPlaying) {
			gm.start();
			$("#play-pause-icon").removeClass("icon-play").addClass("icon-pause");
			isPlaying = true;
		} else {
			gm.stop();
			$("#play-pause-icon").removeClass("icon-pause").addClass("icon-play");
			isPlaying = false;
		}
	});

	$("#speed-up").click(function() {
		gm.setSpeed(gm.getSpeed() + 1);
	});

	$("#speed-down").click(function() {
		gm.setSpeed(gm.getSpeed() - 1);
	});

	$("#zoom-in").click(function() {
		scale = scale * 1.2;
		console.log(scale);
		ctx.scale(1.2, 1.2);
	});

	$("#zoom-out").click(function() {
		scale = scale * 0.8;
		console.log(scale);
		ctx.scale(0.8,0.8);
	});

	//Sets the currentCogWheel to the clicked one if someone is clicked and shows the settings for that wheel.
	var currentCogWheel = null;
	$("#canvas").click(function(e) {
		if(!movingCogWheel){
			var x = e.offsetX;
		    var y = e.offsetY;
			
		    clickedCogWheel = gm.getGearAt(x - lastCoords[0], y - lastCoords[1]);
		    
			if (clickedCogWheel != null) {
				$("#cog-settings").toggle();
				currentCogWheel = clickedCogWheel;
				$("#cog-settings").css({'top':window.event.clientY,'left':window.event.clientX + 10});
			} else {
				if ($('#cog-settings').is(':visible')) {
					$("#cog-settings").toggle();
				}
			}
		}
		else
			movingCogWheel = false;
	});
	
	//Updated the color of the latest clicked one
	$('#cog-color').change(function() {
		if (currentCogWheel != null) {
			currentCogWheel.setColor($('#cog-color').val());
		}
	});
	
	//Updated the transparancy of the latest clicked one
	$('#cog-transparancy').change(function() {
		if (currentCogWheel != null) {
			currentCogWheel.setTransparency($('#cog-transparancy').val()*0.1);
		}
	});
	
	//Updated deletes current cog wheel
	$('#delete-wheel').click(function() {
		if (currentCogWheel != null) {
			console.log("del");
			gm.removeGear(currentCogWheel);
			$("#cog-settings").toggle();
		}
	});

	$("#undo").click(function() {
		gearsArray[gearsArray.length] = gm.gears;
		gm.removeLastGear();

	});

	$("#redo").click(function() {
		gm.redoRemovedGears();
	});

	//Enables the about button to have a popover div.
	$('#about').popover();
	
	
	
});