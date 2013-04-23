<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html>
<html>

<head>
		<meta charset="utf-8">
		<meta charset="utf-8">
		<title>Spirograph</title>
		
		<script type="text/javascript" src="<c:url value="/resources/js/Utility.js" />"></script>

		<script type="text/javascript" src="<c:url value="/resources/js/Gear.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/GearMachine.js" />"></script>		
		
		<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/dragndrop.js" />"></script>
		<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/styles.css" />"></link>
		<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/bootstrap.min.css" />"></link>
		<script type="text/javascript" src="<c:url value="/resources/js/bootstrap.min.js" />"></script>
</head>
<body>
	<div class="row-fluid">
			<div id="accordion2">
				<div class="accordion-group">
					<div class="accordion-heading">
						<a class="accordion-toggle" data-toggle="collapse"
							data-parent="#accordion2" href="#collapseOne">Toolbox </a>
					</div>
					<div id="collapseOne" class="accordion-body collapse in">
						<div class="accordion-inner">
						<canvas id="toolbox-canvas" class="span12">Your browser does not support canvas :-(</canvas>
						</div>
					</div>
				</div>
			</div>
			<div>
  				<canvas id="canvas" class="span12">Your browser does not support canvas :-(</canvas>
  			</div>
	</div>
	
	<script>
	
	/*
	
		// Here i define objects: hardcode actions will be called on gm
		// TODO ID should be sequential to discuss
		var rotAngle = 1;
		var g0 = new Gear(0, 50, 50, "black", 0, 13, 31, 26, 0, 12, 13);
		var g1 = new Gear(1, 70, 105, "black", 0, 13, 31, 26, 9, 7, 13);
//		var g1 = new Gear(1, 70, 105, "black", 0, 13, 31, 26, 9, 7, 13);

		
		// overlap
		var g2 = new Gear(2, 100, 200, "black", 0, 13, 31, 26, 9, 7, 13);

		
		// Then create machine and start it
		var gm = new GearMachine();

		

		gm.placeGear(g0);
		gm.placeGear(g1);
		gm.placeGear(g2);

		gm.setSpeed(2);
		gm.start();
		
		//-----------------------------
		
		
		
		// Define the timer for the animation
		window.requestAnimFrame = (function(callback) {
			return window.requestAnimationFrame
					|| window.webkitRequestAnimationFrame
					|| window.mozRequestAnimationFrame
					|| window.oRequestAnimationFrame
					|| window.msRequestAnimationFrame || function(callback) {
						window.setTimeout(callback, 1000 / 60);
					};
		})();

		// Define the animate function
		function animate() {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');

			// Clear previous canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			//	Rotate gears
	//		g0.rotate(-rotAngle);
		//	g1.rotate(rotAngle);

			// And Draw
//			g0.draw(ctx);
	//		g1.draw(ctx);

			
			gm.tick();
			gm.draw(ctx);
			
			// request new frame
			requestAnimFrame(function() {
				animate();
			});
		}

		// Start animation
		animate();
		
		
		*/
		
	</script>
</body>
</html>
