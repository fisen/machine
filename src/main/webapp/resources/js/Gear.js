/**
 * This class represents a Gear.
 * 
 * @author Magnus Larsson, Marco Dondio
 * @version 1.0
 * 
 * based on mc.drawGear() - by Ric Ewing (ric@formequalsfunction.com) - version
 * 1.4 - 4.7.2002
 * 
 * based on http://pastie.org/929979
 */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/**
 * Gear constructor
 * 
 * @param id
 *            of Gear
 * @param x
 *            x coordinate of the center of the gear
 * @param y
 *            y coordinate of the center of the gear
 * @param color
 *            the color for this gear
 * @param transparency
 *            the value of transparency for this Gear
 * @param sides
 *            number of teeth on gear. (must be > 2)
 * @param innerRadius
 *            radius of the indent of the teeth.
 * @param outerRadius
 *            outer radius of the teeth. Default 4
 * @param angle =
 *            starting angle in degrees. Defaults to 0.
 * @param holeSides
 *            draw a polygonal hole with this many sides (must be > 2)
 * @param holeRadius
 *            size of hole. Default = innerRadius/3.
 * 
 * based on mc.drawGear() - by Ric Ewing (ric@formequalsfunction.com) - version
 * 1.4 - 4.7.2002
 */

function Gear(id, x, y, color, transparency, sides, innerRadius, outerRadius,
		angle, holeSides, holeRadius) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.color = color;
	this.transparency = transparency;
	this.sides = sides;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.angle = angle;
	this.holeSides = holeSides;
	this.holeRadius = holeRadius;
}

/**
 * Retrieves Gear ID
 * 
 * @return id of Gear
 */
Gear.prototype.getID = function() {
	return this.id;
};

/**
 * Retrieves the X position.
 * 
 * @return x x coordinate of the center of this gear
 */
Gear.prototype.getXPos = function() {
	return this.x;
};

/**
 * Sets the new X position.
 * 
 * @param x
 *            x coordinate of the center of this gear
 */
Gear.prototype.setXPos = function(x) {
	this.x = x;
};

/**
 * Retrieves the Y position.
 * 
 * @return x x coordinate of the center of this gear
 */
Gear.prototype.getYPos = function() {
	return this.y;
};

/**
 * Sets the new Y position.
 * 
 * @param y
 *            y coordinate of the center of this gear
 */
Gear.prototype.setYPos = function(y) {
	this.y = y;
};

/**
 * Retrieves the color.
 * 
 * @return color of the gear
 */
Gear.prototype.getColor = function() {
	return this.color;
};

/**
 * Sets the color.
 * 
 * @param color
 *            of the gear
 */
Gear.prototype.setColor = function(color) {
	this.color = color;
};

/**
 * Retrieves the transparency.
 * 
 * @return transparency of the gear
 */
Gear.prototype.getTransparency = function() {
	return this.transparency;
};

/**
 * Sets the transparency.
 * 
 * @param transparency
 *            of the gear
 */
Gear.prototype.setTransparency = function(transparency) {
	this.transparency = transparency;
};

/**
 * Retrieves the sides.
 * 
 * @return sides of the gear
 */
Gear.prototype.getSides = function() {
	return this.sides;
};

/**
 * Retrieves the innerRadius.
 * 
 * @return innerRadius of the gear
 */
Gear.prototype.getInnerRadius = function() {
	return this.innerRadius;
};

/**
 * Retrieves the outerRadius.
 * 
 * @return outerRadius of the gear
 */
Gear.prototype.getOuterRadius = function() {
	return this.outerRadius;
};

/**
 * Retrieves the angle.
 * 
 * @return angle of the gear
 */
Gear.prototype.getAngle = function() {
	return this.angle;
};

/**
 * Sets the angle.
 * 
 * @param angle
 *            of the gear
 */
Gear.prototype.setAngle = function(angle) {
	this.angle = angle;
};

/**
 * Rotates the Gear with respect to current angle.
 * 
 * @param angle
 *            of rotation. Positive for clockwise rotation
 */
Gear.prototype.rotate = function(angle) {
	this.angle += angle;
};


/**
 * Drawing function for this object.
 * 
 * @param ctx
 *            the graphical context object
 */
Gear.prototype.draw = function(ctx) {

	// check that sides is sufficient to build polygon
	if (this.sides <= 2) {
		throw ArgumentError("DrawingShapes.drawGear() - parameter 'sides' needs to be atleast 3");
		return;
	}
	if (this.sides > 2) {
		// calculate length of sides
		var step = (Math.PI * 2) / this.sides;
		var qtrStep = step / 4;
		// calculate starting angle in radians
		var start = (this.angle / 180) * Math.PI;

		ctx.beginPath();

		ctx.moveTo(this.x + (Math.cos(start) * this.outerRadius), this.y
				- (Math.sin(start) * this.outerRadius));
		// draw lines
		for ( var n = 1; n <= this.sides; ++n) {
			var dx = this.x + Math.cos(start + (step * n) - (qtrStep * 3))
					* this.innerRadius;
			var dy = this.y - Math.sin(start + (step * n) - (qtrStep * 3))
					* this.innerRadius;
			ctx.lineTo(dx, dy);
			dx = this.x + Math.cos(start + (step * n) - (qtrStep * 2))
					* this.innerRadius;
			dy = this.y - Math.sin(start + (step * n) - (qtrStep * 2))
					* this.innerRadius;
			ctx.lineTo(dx, dy);
			dx = this.x + Math.cos(start + (step * n) - qtrStep)
					* this.outerRadius;
			dy = this.y - Math.sin(start + (step * n) - qtrStep)
					* this.outerRadius;
			ctx.lineTo(dx, dy);
			dx = this.x + Math.cos(start + (step * n)) * this.outerRadius;
			dy = this.y - Math.sin(start + (step * n)) * this.outerRadius;
			ctx.lineTo(dx, dy);
		}
		// This is complete overkill... but I had it done already. :)
		if (this.holeSides > 2) {
			step = (Math.PI * 2) / this.holeSides;
			ctx.moveTo(this.x + (Math.cos(start) * this.holeRadius), this.y
					- (Math.sin(start) * this.holeRadius));
			for (n = 1; n <= this.holeSides; ++n) {
				dx = this.x + Math.cos(start + (step * n)) * this.holeRadius;
				dy = this.y - Math.sin(start + (step * n)) * this.holeRadius;
				ctx.lineTo(dx, dy);
			}
		}
		ctx.stroke();
		//ctx.fill();

	}
};

/**
 * ToString
 * 
 * @return string representation
 */
Gear.prototype.toString = function() {
	return this.id;
};
