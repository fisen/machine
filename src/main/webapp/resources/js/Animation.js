
/**
*@Author Magnus Larsson, Marco Dondio
**/

/**
 * Constructor for creating an Animation.
 * The animation is not started as standard.
 * 
 * @param animatableObject the object which is animatable (has the functions step() and draw(context)).
 * @param speedValue an integer in the interval [1, 10] where speedValue 1 is 100% of the animation engines speed
 *  	  and speedValue x is (1/X * 100)% of the animation engine's speed.
 */
function Animation(animatableObject, speedValue) {
	this.animatableObject = animatableObject;
	this.running = false;
	
	var speedArr = [1,2,3,4,5,6,7,8,9,10];
	if (speedArr.indexOf(speedValue) === -1 ) { //true if speedValue is not in the interval [1, 10].
		this.speedValue = 1;
	} else {
		this.speedValue = speedValue;
	}
};

/**
 * Function to set the animation to be running or not.
 * @param running (boolean) true for running, false for not.
 */
Animation.prototype.setRunning = function(running) {	
	this.running = running;
};

/**
 * Function that returns if the animation is running or not.
 * @returns {Boolean} true if running, false if not.
 */
Animation.prototype.isRunning = function() {
	return this.running;
};

/**
 * Function to set the relative speed value for this animation.
 * @param speedValue See constructor comments for explanation.
 */
Animation.prototype.setSpeedValue = function(speedValue) {
	var speedArr = [1,2,3,4,5,6,7,8,9,10];
	if (speedArr.indexOf(Value) === -1 ) {
		this.speedValue = 1;
	} else {
		this.speedValue = speedValue;
	}
};

/**
 * Function to retrieve the relative speed value for this animation.
 * @returns {Number} See constructor comments for explanation.
 */
Animation.prototype.getSpeedValue = function() {
	return this.speedValue;
};

/*Animation.prototype.getValue = function() {
	return this.speedValue;
};*/

/**
 * Function to get the object that is animated.
 * @returns the object being animated.
 */
Animation.prototype.getAnimatableObject = function() {
	return this.animatableObject;
};

/**
 * Function that tells the object to update it's state by one step.
 */
Animation.prototype.step = function() {
	this.animatableObject.step();
};


/**
 * Function that tells the object to redraw itself.
 * @param context the context to draw on.
 */
/*
Animation.prototype.draw = function(context) {
	this.animatableObject.draw(context);
};
*/


