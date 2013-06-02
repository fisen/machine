/**
 * This class is controlling the drag and drop function.
 */

$(document).ready(function () {

	var gm = new GearMachine();

	var figures = new Array();
	var toolFigures = new Array();
	
	var state = new UndoRedo();
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
    var neighbours = null;
    var lastNeighbours = null;
	
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
		addToolboxGear(new Gear(0, 0, 0, "#FFCC33", 1, 13, 21, 16, 0, 9, 9));
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
			
			if($(currentCanvas).attr("id") == "canvas"){
				neighbours = gm._getGearNeighboursInfo(currentFigure);
				if(lastNeighbours != null && neighbours != lastNeighbours){
					for(var i=0; i < lastNeighbours.list.length; i++)
						lastNeighbours.list[i].gear.setTransparency(1);
					for(var i=0; i < neighbours.list.length; i++)
						neighbours.list[i].gear.setTransparency(0.5);
				}
				lastNeighbours = neighbours;
			}
			
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
		var x = e.offsetX;
	    var y = e.offsetY;
	    
		currentCanvas = e.target;
		if($(currentCanvas).attr("id") == "canvas"){
			currentFigure = gm.getGearAt(x - lastCoords[0], y - lastCoords[1]);
			if(currentFigure != null) {
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
				if(dragok==true){
					var a=new Array();
					a.push("Delete");
					a.push(currentFigure);
					state.save(a);
				}

				if(gm.placeGear(currentFigure)==true){
					
				}else{
					state.undo();
				}
			}
			catch (err) {
				state.undo();
				state.undo();
				if(startX > 0){
					currentFigure.setXPos(startX - lastCoords[0]);
					currentFigure.setYPos(startY - lastCoords[1]);
					gm.placeGear(currentFigure);
					startX = 0;
					startY = 0;
					console.log(err);
				}					
				
			}
		}
		for(var i=0; i < gm.gears.length; i++)
			gm.gears[i].setTransparency(1);
			
		neighbours = null;
		lastNeighbours = null;
		currentFigure = null;
		panningOk = false;
		gm.printMatrix();
		dragok = false;
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
		var speed = gm.getSpeed();
		if (speed > -12) {
			gm.setSpeed(speed - 1);
		}
	});

	$("#speed-down").click(function() {
		var speed = gm.getSpeed();
		if (speed < 12) {
			gm.setSpeed(speed + 1);
		}
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
			var a = new Array();
			var b = $('#cog-color').val();
			a.push("Color");
			a.push(currentCogWheel);
			a.push(currentCogWheel.getColor());
			a.push(b);
			state.save(a);
			currentCogWheel.setColor(b);
			console.log(state.done.length);
		}
	});
	
	//Updated the transparancy of the latest clicked one
	$('#cog-transparancy').change(function() {
		if (currentCogWheel != null) {
			//var a = new Array();
			//a.push("Transparancy");
			//a.push(currentCogWheel);
			//a.push(b);
			//a.push(currentCogWheel.getTransparency());
			//state.save(a);
			currentCogWheel.setTransparency($('#cog-transparancy').val()*0.1);
		}
	});
	
	//Updated deletes current cog wheel
	$('#delete-wheel').click(function() {
		if (currentCogWheel != null) {
			console.log("del");
			var a = new Array();
			a.push("Add");
			a.push(currentCogWheel);
			state.save(a);
			gm.removeGear(currentCogWheel);
			$("#cog-settings").toggle();
		}
	});

	$("#undo").click(function() {
		var a =state.undo();
		console.log(a);
		if(a!=undefined){
			
			if(a[0]=="first"){
				state.save(first);
				return;
			}
			if(a[0]=="Add"){
				gm.placeGear(a[1]);
				return;
			}
			if(a[0]=="Delete"){
				gm.removeGear(a[1]);
				return;
			}
			if(a[0]=="Color"){
				console.log(a[2]);
				a[1].setColor(a[2]);
				return;
			}
			if(a[0]=="Transparancy"){
				a[1].setTransparancy(a[2]);
				return;
			} 
		}
	});

	$("#redo").click(function() {
		state.redo(gm);
	});

	//Enables the about button to have a popover div.
	$('#about').popover();
	
	
	
});
