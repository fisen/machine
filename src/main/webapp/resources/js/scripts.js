$(document).ready(function () {
    //Getting the canvas and painting a rectangle on it
    var mainCanvas = (document.getElementById("main-canvas"));
    var ctx = mainCanvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight - 100;
    ctx.fillStyle = "red";
    ctx.fillRect(20,20,20,20);

    //Getting the canvas and painting a rectangle on it
    var toolboxCanvas = (document.getElementById("toolbox-canvas"));
    var ctx = toolboxCanvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = 80;
    ctx.fillStyle = "blue";
    ctx.fillRect(20,20,20,20);
    
});