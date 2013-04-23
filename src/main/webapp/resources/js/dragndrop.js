/**
 * This class is controlling the drag and drop function.
 */

$(document).ready(function () {

	var gm = new GearMachine();
	
	var figures = new Array();
	var g0 = new Gear(0, 50, 35, "black", 0, 13, 31, 26, 0, 12, 13);
	var g1 = new Gear(0, 200, 35, "black", 0, 13, 31, 26, 0, 12, 13);
	gm.placeGear(g0);
	gm.placeGear(g1);
	figures[figures.length] = g0;
	figures[figures.length] = g1;

	var canvas = null;
	var ctx = null;
	var toolCanvas = null;
	var toolCtx = null;
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var dragok = false;
	var currentFigure;

	function clear() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}

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
		g0.draw(toolCtx);
		
		setInterval(draw, 10);
	}

	/**
	 * Draw the canvas. This method is called every 10 ms.
	 */
	function draw(){
		clear();
		animate();
		
	//	for(var n=0; n < figures.length; n++)
	//		figures[n].draw(ctx);
	}

	/**
	 * Changes the x and y value for the figure that is currently
	 * being dragged.
	 */
	function myMove(e){
		if (dragok){
			currentFigure.x = e.pageX - canvas.offsetLeft;
			currentFigure.y = e.pageY - canvas.offsetTop;
		}
	}

	/**
	 * Called when the user presses the mousebutton.
	 * Checks if a gear was pressed.
	 */
	function myDown(e){
		for(var n=0; n < figures.length; n++){
			if (e.pageX < figures[n].x + 15 + canvas.offsetLeft && e.pageX > figures[n].x - 15 +
					canvas.offsetLeft && e.pageY < figures[n].y + 15 + canvas.offsetTop &&
					e.pageY > figures[n].y -15 + canvas.offsetTop){
				currentFigure = figures[n];
				figures[n].x = e.pageX - canvas.offsetLeft;
				figures[n].y = e.pageY - canvas.offsetTop;
				dragok = true;
				canvas.onmousemove = myMove;
				break;
			}
		}
	}

	/**
	 * Called when the user releases the mousebutton.
	 */
	function myUp(){
		dragok = false;
		canvas.onmousemove = null;
	}
	
	//Only for testing
	function animate(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		gm.tick();
		gm.draw(ctx);
	}

	init();
	canvas.onmousedown = myDown;
	canvas.onmouseup = myUp;
	gm.start();
});