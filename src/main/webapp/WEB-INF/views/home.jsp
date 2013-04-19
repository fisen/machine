<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Spirograph</title>
		<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="<c:url value="/resources/js/scripts.js" />"></script>
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
  				<canvas id="main-canvas" class="span12">Your browser does not support canvas :-(</canvas>
  			</div>
	</div>
	</body>
</html>
