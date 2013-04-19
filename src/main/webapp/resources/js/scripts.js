$(document).ready(function () {
    //Getting the canvas and painting a rectangle on it
    var mainCanvas = (document.getElementById("main-canvas"));
    var ctx = mainCanvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.fillRect(20,20,20,20);
    
    ctx.onclick = function() {
    	alert("hej");
    }
});