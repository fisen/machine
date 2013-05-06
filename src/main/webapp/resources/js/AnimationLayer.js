/**
*@Author Magnus Larsson, Marco Dondio
**/

/**
 * Constructor for creating an AnimationLayer, represented by an array.
 */
function AnimationLayer() {
	this.animationArray = [];
};

/**
 * Function to retrieve the Animation, given an animatableObject, from this AnimationLayer.
 * @param animatableObject the animatableObject used to find the related Animation from.
 * @returns the Animation related to the animatableObject if it exists in the AnimationLayer, else it returns null.
 */
AnimationLayer.prototype.getAnimation = function(animatableObject) {
	for (var i = 0; i < this.animationArray.length; i++) { //Look for a match of the animatableObject in the array of Animations.
		var obj = this.animationArray[i].getAnimatableObject();
		
		if (obj === animatableObject) {
			return this.animationArray[i];
		}
	}
	return null;
};

/**
 * Function to retrieve the complete array of animations.
 * @returns {Array} the array containing all the animations.
 */
AnimationLayer.prototype.getAnimations = function() {
	return this.animationArray;
};

/**
 * Function to retrieve all the animations that are running.
 * @returns {Array} an array of running animations.
 */
AnimationLayer.prototype.getRunningAnimations = function() {
	var runningAnimations = new Array();
	for (var i = 0; i < this.animationArray.length; i++) { //Gather all running animations
		if (this.animationArray[i].isRunning()) {
			runningAnimations.push(this.animationArray[i]);
		};
	}
	return runningAnimations;
};

/**
 * Function to add an animation.
 * @param animation the animation to be added to this AnimationLayer.
 */
AnimationLayer.prototype.addAnimation = function(animation) {
	this.animationArray.push(animation);
};

/**
 * Function to remove an animation.
 * @param animation the animation you want to remove from this AnimationLayer.
 */
AnimationLayer.prototype.removeAnimation = function(animation) {
	var i = this.animationArray.indexOf(animation);
	
	if (i !== -1) { //True if te animation exists in the array of animations.
		this.animationArray.splice(i, 1);  // XXX check if works
	}
};