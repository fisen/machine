<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html>
<html>
<head>
		<meta charset="utf-8">
		<meta charset="utf-8">
		<title>Machine</title>

		<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/bootstrap.min.js" />"></script>

		<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/styles.css" />"></link>
		<link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/bootstrap.min.css" />"></link>
        <link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/font-awesome.min.css" />"></link>
		
		<script type="text/javascript" src="<c:url value="/resources/js/UndoRedo.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/Utility.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/Gear.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/GearMachine.js" />"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/dragndrop.js" />"></script>
</head>
<body>
	<div class="row-fluid">
			<div id="accordion2" class="unselectable">
				<div class="accordion-group">
                <div class="accordion-heading">
                    <div class="btn-group">
                        <a class="btn" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne"><i class="icon-cogs icon-large"></i></a>
                        <a class="btn" id="speed-down" href="#"><i class="icon-fast-backward icon-large"></i></a>
                        <a class="btn" id="play-pause" href="#"><i id="play-pause-icon" class="icon-play icon-large"></i></a>
                        <a class="btn" id="speed-up" href="#"><i class="icon-fast-forward icon-large"></i></a>
                        <a class="btn" id="undo" href="#"><i class="icon-undo icon-large"></i></a>
                        <a class="btn" id="redo" href="#"><i class="icon-repeat icon-large"></i></a>
                        <a class="btn" id="zoom-out" href="#"><i class="icon-zoom-out icon-large"></i></a>
                        <a class="btn" id="zoom-in" href="#"><i class="icon-zoom-in icon-large"></i></a>
                    </div>
                    <a id="about" href="#" class="btn btn-info" rel="popover" data-placement="bottom" data-original-title="Machine" data-content="This is project inspired from spirographs. Play around with the cogwheel's by draging them into the big area and push the play button.">About</a>
                    <a id="help" href="#" class="btn btn-warning">Help</a>
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
    <div id="cog-settings" style="display:none">
        <p>Choose color</p>
        <input type="color" id="cog-color">
        <p>Choose opacity</p>
        <input type="range" id="cog-transparancy" min="1" max="10">
        <a class="btn btn-danger" id="delete-wheel" href="#"><i class="icon-trash icon-large"></i> Delete</a>
    </div>
</body>
</html>
