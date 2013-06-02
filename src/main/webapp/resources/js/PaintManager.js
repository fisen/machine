/**
* @Author Magnus Larsson
*/

/**
 * Creates a PaintManager which manages the repainting of drawable objects on a canvas.
 */
function PaintManager(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
	this.basePaintableObjects = new Array();
	
	this.xTransform = 0; //pixels to transform in horizontal vector.
	this.yTransform = 0; //pixels to transform in vertical vector.
	this.scale = 1;	//rescaling.
};

/**
 * Function used to retrieve the canvas.
 * @returns the canvas.
 */
PaintManager.prototype.getCanvas = function() {
	return this.canvas;
};

/**
 * Function used to set the canvas.
 * @param canvas
 */
PaintManager.prototype.setCanvas = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');
};

/**
 * Function used to transform the canvas coordinates.
 * @param xTransformValue pixels to transform the canvas in x-vector.
 * @param yTransformValue pixels to transform the canvas in y-vector.
 */
PaintManager.prototype.setCanvasTransformValues = function(xTransformValue, yTransformValue) {
	this.xTransform = xTransformValue;
	this.yTransform = yTransformValue;
};

/**
 * Function used to retrieve the transformation value in x-factor.
 * @returns {Number} the transformation value in x-factor. (in pixels)
 */
PaintManager.prototype.getXTransformValue = function() {
	return this.xTransform;
};

/**
 * Function used to retrieve the transformation value in y-factor.
 * @returns {Number} the transformation value in y-factor. (in pixels)
 */
PaintManager.prototype.getYTransformValue = function() {
	return this.yTransform;
};

/**
 * Function used to scale the canvas.
 * @param scaleValue value to scale the canvas with.
 */
PaintManager.prototype.setCanvasScaleValue = function(scaleValue) {
	this.scale = scaleValue;
};

/**
 * Function used to retrieve the scale value of the canvas.
 * @returns {Number} the scale value of the canvas.
 */
PaintManager.prototype.getCanvasScaleValue = function() {
	return this.scale;
};

/**
 * Function used to retrieve all the basePaintableObjects.
 * @returns {Array} the basePaintableObjects.
 */
PaintManager.prototype.getBasePaintableObjects = function() {
	return this.basePaintableObjects;
};

/**
 * Function to add paintableObjects which are acting as the first layer/base.
 * @param paintableObject the paintableObject to be added.
 */
PaintManager.prototype.addBasePaintableObject = function(paintableObject) {
	this.basePaintableObjects.push(paintableObject);
	return paintableObject; //Useful for storing reference.
};

/**
 * Function to remove a paintableObject from the group of base paintableObjects.
 * @param paintableObject the paintableObject to be removed.
 * @returns {Boolean} true if given paintableObject existed in the group and was removed, else false.
 */
PaintManager.prototype.removeBasePaintableObject = function(paintableObject) {
	var index = this.basePaintableObjects.indexOf(paintableObject);
	
	if (index !== -1) { //True if paintableObject exists within basePaintableObjects.
		this.basePaintableObjects.splice(index, 1);
		return true;
	};
	return false;
};

/**
 * Function used to repaint all paintableObjects that are being managed.
 */
PaintManager.prototype.repaint = function() {
	this.clear(0, 0, this.canvas.width, this.canvas.height);
	
	for (var i = 0; i < this.basePaintableObjects.length; i++) {
		this.context.save();
		this.context.setTransform(this.scale, 0, 0, this.scale, this.xTransform, this.yTransform);
		this.basePaintableObjects[i].draw(this.canvas, this.context, 0, 0);
		this.context.restore();
	};
};

/**
 * Function used to repaint the area within a certain boundary.
 * @param x1 
 * @param y1
 * @param x2
 * @param y2
 */
PaintManager.prototype.paint = function(x1, y1, x2, y2) { //Simple now, advance later
	this.clear(x1, y1, x2 - x1, y2 - y1);
	
	for (var i = 0; i < this.basePaintableObjects.length; i++) {
		this.context.save();
		this.context.setTransform(this.scale, 0, 0, this.scale, this.xTransform, this.yTransform);
		this.basePaintableObjects[i].drawArea(this.canvas, this.context, x1, y1, x2, y2, 0, 0);
		this.context.restore();
	};
};

/**
 * Function called to request repainting of a certain area.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
PaintManager.prototype.paintRequest = function(x1, y1, x2, y2) {
	this.paint(x1, y1, x2, y2);
};

/**
 * Function used to create a PaintableObject.
 * @param drawableObject the drawableObject which contains a draw(canvas) method.
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns {PaintableObject}
 */
PaintManager.prototype.createPaintableObject = function(drawableObject, x, y, width, height) {
	return new PaintableObject(drawableObject, x, y, width, height, this);
};

/**
 * Function used to clear a specific area of the canvas.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
PaintManager.prototype.clear = function(x1, y1, x2, y2) {
	this.context.save();
	this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(x1, y1, x2 - x1, y2 - y1);
	this.context.restore();
};