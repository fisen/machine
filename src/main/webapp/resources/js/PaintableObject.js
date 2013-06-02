/**
 * @Author Magnus Larsson
 */

// ADD LAYERS?????

/**
 * Creates a PaintableObject which is used by a PaintManager for painting management.
 */

function PaintableObject(drawableObject, x, y, width, height, paintManager) {
	this.drawableObject = drawableObject;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.paintManager = paintManager;
	this.children = new Array();
	this.visible = true; //Implement the functionality for this.
};

/**
 * Function used to get the related drawableObject to this object.
 * @returns the related drawableObject.
 */
PaintableObject.prototype.getDrawableObject = function() {
	return this.drawableObject;
};

/**
 * Function used to set the drawableObject to this object.
 * @param drawableObject the drawableObject to set.
 */
PaintableObject.prototype.setDrawableObject = function(drawableObject) {
	this.drawableObject = drawableObject;
};

/**
 * Function used to retrieve the x position for the drawing.
 * @returns the x position
 */
PaintableObject.prototype.getX = function() {
	return this.x;
};

/**
 * Function used to set the x position for the drawing.
 * @param x the x position
 */
PaintableObject.prototype.setX = function(x) {
	this.x = x;
};

/**
 * Function used to retrieve the y position for the drawing.
 * @returns the y position
 */
PaintableObject.prototype.getY = function() {
	return this.y;
};

/**
 * Function used to set the y position for the drawing.
 * @param y the y position
 */
PaintableObject.prototype.setY = function(y) {
	this.y = y;
};

/**
 * Function used to retrieve the width for the drawing.
 * @returns width the width for the drawing. (in pixels)
 */
PaintableObject.prototype.getWidth = function() {
	return this.width;
};

/**
 * Function used to set the width for the drawing.
 * @param width the desired width. (in pixels)
 */
PaintableObject.prototype.setWidth = function(width) {
	this.width = width;
};

/**
 * Function used to retrieve the height for the drawing.
 * @returns height the height for the drawing. (in pixels)
 */
PaintableObject.prototype.getHeight = function() {
	return this.height;
};

/**
 * Function used to set the height for the drawing.
 * @param height the desired height. (in pixels)
 */
PaintableObject.prototype.setHeight = function(height) {
	this.height = height;
};

/**
 * Function used to set the visibility of the drawing.
 * @param visible true if visible, false if not.
 */
PaintableObject.prototype.setVisible = function(visible) { 
	this.visible = visible;
};

/**
 * Function used to retrieve the children of this object.
 * @returns {Array} Children of this object.
 */
PaintableObject.prototype.getChildren = function() {
	return this.children;
};

/**
 * Function used to add a child to this object.
 * @param paintableObject the child to be added.
 */
PaintableObject.prototype.addChild = function(paintableObject) {
	this.children.push(paintableObject);
};

/**
 * Function used to remove a specific child from this object.
 * @param paintableObject the child to be removed.
 * @returns {Boolean} true if it existed as a child and was removed, false if not.
 */
PaintableObject.prototype.removeChild = function(paintableObject) {
var index = this.children.indexOf(paintableObject);
	
	if (index !== -1) { //True if paintableObject is a child of this object.
		this.children.splice(index, 1);
		return true;
	};
	return false;
};

/**
 * Function used to add a child to this object, but using a drawableObject as reference.
 * 
 * @param drawableObject
 * @param x
 * @param y
 * @param width
 * @param height
 */
PaintableObject.prototype.addDrawableChild = function(drawableObject, x, y, width, height) {
	this.addChild(new PaintableObject(drawableObject, x, y, width, height, this.paintManager));
};

/**
 * Function used to remove a child from this object, using a DrawableObject to locate the PaintableObject.
 * @param drawableObject
 * @returns {Boolean} true if the child existed and was removed, else false.
 */
PaintableObject.prototype.removeDrawableChild = function(drawableObject) {
	
	for (var i = 0; i < this.children.length; i++) { //Step through each child and compare their DrawableObjects.
		if (this.children[i].getDrawableObject === drawableObject) {
			this.children.splice(i, 1);
			return true;
		};
	};
	return false;
};

/**
 * Function used by a PaintManager to draw this object's drawable and its children.
 * @param canvas
 * @param context
 */
PaintableObject.prototype.draw = function(canvas, context, xOffset, yOffset) {
	context.save();
	context.beginPath();
	context.translate(xOffset, yOffset);
	context.rect(this.x, this.y, this.width, this.height);
	//context.clip(); //Draw only within the drawable's bounds.
	this.drawableObject.draw(context);
	context.restore();
	
	this._drawChildren(canvas, context, xOffset + this.x, yOffset + this.y);
};

/**
 * Function used by a PaintManager to draw a certain part of this object's drawable and also of its children's.
 * @param canvas
 * @param context
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
PaintableObject.prototype.drawArea = function(canvas, context, x1, y1, x2, y2, xOffset, yOffset) {
	context.save();
	context.beginPath();
	context.translate(xOffset, yOffset);
	context.rect(x1, y1, x2 - x1, y2 - y1);
	//context.clearRect(x1, y1, x2 - x1, y2 - y1);
	//context.clip(); //Draw only within the drawable's bounds.
	this.drawableObject.draw(context);
	context.restore();
	
	this._drawChildrenInArea(canvas, context, x1, y1, x2, y2, xOffset + this.x, yOffset + this.y);
};

/**
 * Function used by the user to request a repaint of this object's drawable.
 */
PaintableObject.prototype.repaint = function() {
	this.paintManager.paintRequest(this.x, this.y, this.x + this.width, this.y + this.height);
};

/**
 * Function used to get information if a given point (x, y) is within this object or not.
 * @param x
 * @param y
 * @returns {Boolean} true if (x, y) is within this object, else false.
 */
PaintableObject.prototype.contains = function(x, y) {
	
	if ((x >= this.x) && (x <= this.x + this.width) && (y >= this.y) && (y <= this.y + this.height)) {
		return true;
	};
	return false;
};

/**
 * "Private" function used to draw the children of this object.
 * @param canvas
 * @param context
 */
PaintableObject.prototype._drawChildren = function(canvas, context, xOffset, yOffset) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].draw(canvas, context, xOffset, yOffset);
	};
};

/**
 * "Private" function used to draw a specific area of the children of this object.
 * @param canvas
 * @param context
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
PaintableObject.prototype._drawChildrenInArea = function(canvas, context, x1, y1, x2, y2, xOffset, yOffset) { //Advance later
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].drawArea(canvas, context, x1, y1, x2, y2, xOffset, yOffset);
	};
};