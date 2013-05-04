/**
 * This class is controlling the drag and drop function.
 */

$(document).ready(function () {

	var gm = new GearMachine();

	var figures = new Array();
	var toolFigures = new Array();

	/*	var g0 = new Gear(0, 50, 35, "black", 0, 13, 31, 26, 0, 12, 13);
	var g1 = new Gear(0, 200, 35, "black", 0, 13, 31, 26, 0, 12, 13);
	gm.placeGear(g0);
	gm.placeGear(g1);
	figures[figures.length] = g0;
	figures[figures.length] = g1; */

	var canvas = null;
	var ctx = null;
	var toolCanvas = null;
	var toolCtx = null;
	var currentCanvas = null;
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var dragok = false;
	var currentFigure = null;
	var startX=0, startY=0;
	var interval = null;
	var nbrGears = 0;

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

		addToolboxGear(new Gear(0, 0, 0, "black", 1, 13, 31, 26, 0, 12, 13));
	//	addToolboxGear(new Gear(0, 0, 0, "black", 1, 13, 16, 8, 0, 12, 13));
		
		draw();
	}

	/**
	 * Clears both canvases
	 */
	function clear() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		toolCtx.clearRect(0, 0, WIDTH, 80);
	}

	/**
	 * Draw the canvas. This method is called every 100 ms when the user presses the mouse.
	 */
	function draw(){
		clear();
		for(var n=0; n < toolFigures.length; n++)
			toolFigures[n].draw(toolCtx);

		gm.step();
		gm.draw(ctx);

		if(currentFigure != null)
			currentFigure.draw(currentCanvas.getContext("2d"));
	}

	/**
	 * Changes the x and y value for the figure that is currently
	 * being dragged.
	 */
	function myMove(e){
		if (dragok && currentFigure != null){
			currentCanvas = e.target;
			currentFigure.setTransparency(0.5);
			currentFigure.setXPos(e.pageX - $(currentCanvas).offset().left);
			currentFigure.setYPos(e.pageY - $(currentCanvas).offset().top);
		}
	}

	/**
	 * Called when the user presses the mousebutton.
	 * Checks if a gear was pressed.
	 */
	function myDown(e){
		currentCanvas = e.target;
		if($(currentCanvas).attr("id") == "canvas"){
			for(var n=0; n < figures.length; n++){
				if (e.pageX < figures[n].getXPos() + figures[n].getInnerRadius() + $(canvas).offset().left &&
						e.pageX > figures[n].getXPos() - figures[n].getInnerRadius() + $(canvas).offset().left &&
						e.pageY < figures[n].getYPos() + figures[n].getInnerRadius() + $(canvas).offset().top &&
						e.pageY > figures[n].getYPos() - figures[n].getInnerRadius() + $(canvas).offset().top){
					currentFigure = figures[n];
					figures.splice(n, n+1);
					startX = currentFigure.getXPos();
					startY = currentFigure.getYPos();
					break;
				}
			}
		}
		else{
			for(var n=0; n < toolFigures.length; n++){
				if (e.pageX < toolFigures[n].getXPos() + toolFigures[n].getInnerRadius() + $(toolCanvas).offset().left &&
						e.pageX > toolFigures[n].getXPos() - toolFigures[n].getInnerRadius() + $(toolCanvas).offset().left &&
						e.pageY < toolFigures[n].getYPos() + toolFigures[n].getInnerRadius() + $(toolCanvas).offset().top &&
						e.pageY > toolFigures[n].getYPos() - toolFigures[n].getInnerRadius() + $(toolCanvas).offset().top){
					currentFigure = clone(toolFigures[n]);
					break;
				}
			}
		}
		dragok = true;
		canvas.onmousemove = myMove;
		toolCanvas.onmousemove = myMove;
		interval = setInterval(draw, 50);

	}

	/**
	 * Called when the user releases the mouse button.
	 */
	function myUp(){
		dragok = false;
		canvas.onmousemove = null;
		toolCanvas.onmousemove = null;
		if(currentFigure != null){
			//clearInterval(interval);
			currentFigure.setTransparency(1);
			try{
				gm.placeGear(currentFigure);
			}
			catch(err){
				if(startX > 0){
					currentFigure.setXPos(startX);
					currentFigure.setYPos(startY);
					figures[figures.length] = currentFigure;
					startX = 0;
					startY = 0;
				}					
				console.log(err);
			}
			//figures[figures.length] = currentFigure;
		}
		currentFigure = null;
		draw();
		gm.printMatrix();
	}


	/**
	 * Adds a gear to the toolbox. The gears x and y values are modified to
	 * fit in the toolbox.
	 */
	function addToolboxGear(newGear){
		newGear.setXPos((toolFigures.length + 1) * 50);
		newGear.setYPos(35);
		toolFigures[toolFigures.length] = newGear;
	}

	/**
	 * Returns an exact copy of gear.
	 */
	function clone(gear){
		return new Gear(nbrGears++, gear.getXPos(), gear.getYPos(), gear.getColor(), gear.getTransparency(),
				gear.getSides(), gear.getInnerRadius(), gear.getOuterRadius(), gear.getAngle(),
				12, 13);
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
		ctx.scale(2,2);
		ctx.save();
		draw();
		ctx.restore();
	});

	$("#zoom-out").click(function() {
		ctx.scale(0.5,0.5);
		ctx.save();
		draw();
		ctx.restore();
	});

	$("#undo").click(function() {
	});

	$("#redo").click(function() {
	});

	//Enables the about button to have a popover div.
	$('#about').popover();
});