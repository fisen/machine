/**
 * This class is controlling the drag and drop function.
 */

$(document).ready(function () {

	var canvas = (document.getElementById("canvas"));
	var toolCanvas = (document.getElementById("toolbox-canvas"));
	
	var canvasPaintManager = new PaintManager(canvas);
	var toolCanvasPaintManager = new PaintManager(toolCanvas);
	
	var gm = new GearMachine(canvasPaintManager);
	
	canvasPaintManager.addBasePaintableObject(canvasPaintManager.createPaintableObject(gm, 0, 0, window.innerWidth, window.innerHeight - 100));
	
	var animationEngine = new AnimationEngine(1, 15, self);
	
	animationEngine.addAnimatableObject(gm, 1, 1);
	animationEngine.startEngine();

	var figures = new Array();
	var toolFigures = new Array();
	
	var state = new UndoRedo();
	//var canvas = null;
	var ctx = null;
	//var toolCanvas = null;
	var toolCtx = null;
	var currentCanvas = null;
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var dragok = false;
	var currentFigure = null;
	var currentFigureGfx = null;
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
		ctx = canvas.getContext("2d");
		ctx.canvas.width  = WIDTH;
		ctx.canvas.height = HEIGHT - 100;

		
		toolCtx = toolCanvas.getContext("2d");
		toolCtx.canvas.width  = window.innerWidth;
		toolCtx.canvas.height = 100;

		addToolboxGear(new Gear(0, 0, 0, "#0000CC", 1, 13, 36, 31, 0, 9, 15));
		addToolboxGear(new Gear(0, 0, 0, "#FF0000", 1, 13, 31, 26, 0, 9, 13));
		addToolboxGear(new Gear(0, 0, 0, "#00CC00", 1, 13, 26, 21, 0, 9, 11));
		addToolboxGear(new Gear(0, 0, 0, "#FFCC33", 1, 13, 21, 16, 0, 9, 9));
		//setInterval(draw, 5);
	}

	/**
	 * Changes the x and y value for the figure that is currently
	 * being dragged.
	 */
	function myMove(e) {
	    var x = e.offsetX;
	    var y = e.offsetY;
	    
		if (dragok && currentFigure != null){
			var lastCanvas = currentCanvas;
			movingCogWheel = true;
			currentCanvas = e.target;
			currentFigure.setTransparency(0.5);
			currentFigure.setXPos(x);
			currentFigure.setYPos(y);
			if($(currentCanvas).attr("id") == "canvas") {
				
				if (lastCanvas !== currentCanvas) {
					toolCanvasPaintManager.removeBasePaintableObject(currentFigureGfx);
					canvasPaintManager.addBasePaintableObject(currentFigureGfx);
				}
				currentFigure.setXPos((x - lastCoords[0])/scale);
				currentFigure.setYPos((y - lastCoords[1])/scale);
				neighbours = gm._getGearNeighboursInfo(currentFigure);
				if(lastNeighbours != null && neighbours != lastNeighbours){
					for(var i=0; i < lastNeighbours.list.length; i++)
						lastNeighbours.list[i].gear.setTransparency(1);
					for(var i=0; i < neighbours.list.length; i++)
						neighbours.list[i].gear.setTransparency(0.5);
				}
				lastNeighbours = neighbours;
			} else {
				if (lastCanvas !== currentCanvas) {
					canvasPaintManager.removeBasePaintableObject(currentFigureGfx);
					toolCanvasPaintManager.addBasePaintableObject(currentFigureGfx);
				}
			}
			canvasPaintManager.repaint();
			toolCanvasPaintManager.repaint();
		} else if (dragok && gm.getGearAt(x, y) == null && panningOk) {
			//Dragging the workspace
			canvasPaintManager.setCanvasTransformValues(x - startCoords[0], y - startCoords[1]);
			canvasPaintManager.repaint();
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
			currentFigure = gm.getGearAt((x - lastCoords[0])/scale, (y - lastCoords[1])/scale);
			if(currentFigure != null) {
				if(!gm.active){
                    startX = currentFigure.getXPos();
                    startY = currentFigure.getYPos();
                    gm.removeGear(currentFigure);
                    currentFigureGfx = canvasPaintManager.addBasePaintableObject(canvasPaintManager.createPaintableObject(currentFigure, 0, 0, canvas.width, canvas.height))
				}
				else
					currentFigure = null;
			} else
				panningOk = true;
		}
		else {
			for (var n=0; n < toolFigures.length; n++) {
				if (e.pageX < toolFigures[n].getXPos() + toolFigures[n].getInnerRadius() + $(toolCanvas).offset().left &&
						e.pageX > toolFigures[n].getXPos() - toolFigures[n].getInnerRadius() + $(toolCanvas).offset().left &&
						e.pageY < toolFigures[n].getYPos() + toolFigures[n].getInnerRadius() + $(toolCanvas).offset().top &&
						e.pageY > toolFigures[n].getYPos() - toolFigures[n].getInnerRadius() + $(toolCanvas).offset().top) {
					currentFigure = clone(toolFigures[n]);
					currentFigureGfx = toolCanvasPaintManager.addBasePaintableObject(canvasPaintManager.createPaintableObject(currentFigure, 0, 0, canvas.width, canvas.height))
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
				if(dragok==true) {
					var a=new Array();
					a.push("Delete");
					a.push(currentFigure);
					state.save(a);
				}

				if(gm.placeGear(currentFigure)==true){
					
				} else {
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
		
		canvasPaintManager.removeBasePaintableObject(currentFigureGfx);
		toolCanvasPaintManager.removeBasePaintableObject(currentFigureGfx);
		
		canvasPaintManager.repaint();
		toolCanvasPaintManager.repaint();
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
		toolCanvasPaintManager.addBasePaintableObject(toolCanvasPaintManager.createPaintableObject(newGear, 0, 0, toolCanvas.width, toolCanvas.height));
		toolCanvasPaintManager.repaint();
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
			animationEngine.startAnimation(gm);
			$("#play-pause-icon").removeClass("icon-play").addClass("icon-pause");
			isPlaying = true;
		} else {
			gm.stop();
			animationEngine.stopAnimation(gm);
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
		canvasPaintManager.setCanvasScaleValue(scale);
		canvasPaintManager.repaint();
	});

	$("#zoom-out").click(function() {
		scale = scale * 0.8;
		console.log(scale);
		canvasPaintManager.setCanvasScaleValue(scale);
		canvasPaintManager.repaint();
	});

	//Sets the currentCogWheel to the clicked one if someone is clicked and shows the settings for that wheel.
	var currentCogWheel = null;
	$("#canvas").click(function(e) {
		if(!movingCogWheel){
			var x = e.offsetX;
		    var y = e.offsetY;
			
		    clickedCogWheel = gm.getGearAt((x - lastCoords[0])/scale, (y - lastCoords[1])/scale);
		    
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
		canvasPaintManager.repaint();
	});

	$("#redo").click(function() {
		state.redo(gm);
		canvasPaintManager.repaint();
	});
	
	$("#help").click(function() {
		$("#glasspane").css({display:"block"});

		var offsetsStart = $('#help').offset();
		var startPointTop = offsetsStart.top + 20;
		var startPointLeft = offsetsStart.left + 20;
		$("#cursor-image").css({"top": startPointTop+"px", "left": startPointLeft+"px"});

		var offsetsGoal = $('#toolbox-canvas').offset();
		var goalPointTop = offsetsGoal.top + 40;
		var goalPointLeft = offsetsGoal.left + 30;
		
		var diffLeft = startPointLeft - goalPointLeft;
		var diffTop = startPointTop - goalPointTop;
		
		setTimeout(function() {
			$("#cursor-image").animate({"left": "-="+diffLeft, "top": "-="+diffTop}, "slow", function() {
				
				var pointerOffset = $('#cursor-image').offset();
				var pointerPosY = pointerOffset.top + 10;
				var pointerPosX = pointerOffset.left + 10;
				
				$("#text-glasspane").css({"top": pointerPosY+"px", "left": pointerPosX+"px"});
				$("#text-glasspane").css({display: "block"});
			});
		},1000);
	});

	$("#text-glasspane-button1").click(function() {
		var pointerOffset = $('#cursor-image').offset();
		var pointerPosY = pointerOffset.top - 10;
		var pointerPosX = pointerOffset.left - 10;
		$("#cursor-image").css({"top": pointerPosY+"px", "left": pointerPosX+"px"});
		$("#cursor-image").attr("src", 'resources/img/cursor_with_cog.png');
		
		setTimeout(function() {
			$("#cursor-image").animate({"left": "+="+100, "top": "+="+ 100}, "slow", function() {
				
				var pointerOffset = $('#cursor-image').offset();
				var pointerPosY = pointerOffset.top + 75;
				var pointerPosX = pointerOffset.left + 75;
				
				$("#text-glasspane2").css({"top": pointerPosY+"px", "left": pointerPosX+"px"});
				$("#text-glasspane2").css({display: "block"});
			});
		},1000);
	});
	
	$("#text-glasspane-button2").click(function() {
		$("#glasspane").css({display:"none"});
		$("#cursor-image").attr("src", 'http://www.lmsify.com/cursor.png');
	});
	
	//Enables the about button to have a popover div.
	$('#about').popover();
	
	$("#glasspane").css({height:$(window).height()});
	$("#glasspane").css({width:$(window).width()});
	
});
