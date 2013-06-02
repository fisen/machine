/**
 * @Author Magnus Larsson, Marco Dondio
 */

/**
 * Constructor for creating an AnimationEngine with support for multiple layers and a defined speed interval in milliseconds.
 * 
 * @param amountOfLayers a number [1, N] of layers wanted.
 * @param maximumSpeed the engine's (maximum). This is the interval, in milliseconds, that the engine will run.
 */
function AnimationEngine(amountOfLayers, maximumSpeed, window) { // Error
																	// handling,
																	// defensive
																	// programming
	this.engineTimerID; //used to store a reference to the timer which the engine is based on.
	this.maximumSpeed = maximumSpeed; // speed 1 = maximumSpeed, speed x =
										// maximumSpeed * x, speed is the
										// interval in milliseconds
	this.window = window;
	this.engineRunning = false;
	this.frameCounter = 0; //used to determine which animations to update, based on their relative speed value.
	this.layers = []; // Background = layer 0

	for ( var i = 0; i < amountOfLayers; i++) { //Add the layers.
		this.layers.push(new AnimationLayer());
	}
	;
};

/**
 * Function to add an animatableObject that you want to animate.
 * @param animatableObject The animatableObject you want to animate.
 * @param layerIndex The layer you want to place the Animation in.
 * @param speedValue The relative speed value of the Animation that is created from the animatableObject.
 * 			An integer in the interval [1, 10] where speedValue 1 is 100% of the animation engines speed
 *  	  	and speedValue x is (1/X * 100)% of the animation engine's speed.
 */
AnimationEngine.prototype.addAnimatableObject = function(animatableObject,
		layerIndex, speedValue) {
	var animation = new Animation(animatableObject, speedValue);

	if (layerIndex >= 0 && layerIndex < this.layers.length) { // If the layer exists, add the animation to that layer.																
		this.layers[layerIndex].addAnimation(animation);
	} else { // Else add it to the first layer.
		this.layers[0].addAnimation(animation);
	}
	;
};

/**
 * Function to remove an Animation/animatableObject from this AnimationEngine.
 * @param animatableObject the animatableObject you wish to remove from this AnimationEngine.
 */
AnimationEngine.prototype.removeAnimatableObject = function(animatableObject) {
	var layerIndex = getLayerIndex(animatedObject);
	if (layerIndex === -1) { //True if the animation for the animatableObject doesn't exist.
		return;
	}
	var layer = _getLayer(layerIndex);
	/*if (layer === null) {
		return;
	}*/
	var animation = layer.getAnimation(animatableObject); //Merge this and next line in AnimationLayer.
	layer.removeAnimation(animation);
};

/**
 * Function to set an animation to run.
 * @param animatableObject the animatableObject which you want to start animate.
 */
AnimationEngine.prototype.startAnimation = function(animatableObject) {
	var animation = this._getAnimation(animatableObject);

	if (animation !== null) { //True if the animatableObject exists within an Animation within this engine.
		animation.setRunning(true);
	}
};

/*
 * AnimationEngine.prototype.startStepLimitedAnimation =
 * function(animatableObject, steps) {
 *  };
 */// Probably not needed

/**
 * Function to stop an animation from running.
 * @param animatableObject the animatableObject which you want to stop animate.
 */
AnimationEngine.prototype.stopAnimation = function(animatableObject) {
	var animation = this._getAnimation(animatableObject);
	if (animation !== null) { //True if the animatableObject exists within an Animation within this engine.
		animation.setRunning(false);
	}
};

/**
 * Function to move an animatableObject to a different layer.
 * @param animatableObject the animatableObject to move.
 * @param layerIndex the index of a layer you want to move the animatableObject to.
 */
AnimationEngine.prototype.setLayer = function(animatableObject, layerIndex) {
	var currentLayer = _getLayer(getLayerIndex(animatableObject));

	if (currentLayer === null && layerIndex < 0 && layerIndex >= layers.length) { //True if the engine does not contain the animatableObject OR that the desired layer does not exist.
		return;
	};
	var animation = currentLayer.getAnimation(animatableObject);
	currentLayer.removeAnimation(animation);
	_getLayer(layerIndex).addAnimation(animation);
};

/**
 * Function to retrieve the index of a layer for a specified animatableObject.
 * @param animatableObject The specified animatableObject from you wish to get the index of it's layer.
 * @returns {Number} the index of the layer, -1 if the animatableObject does not exist in any layer.
 */
AnimationEngine.prototype.getLayerIndex = function(animatableObject) {
	for ( var i = 0; i < this.layers.length; i++) { //Search for the animatableObject in the layers, return layer index if found.
		if (this.layers[i].getAnimation !== null) {
			return i;
		};
	};
	return -1;
};

/**
 * Function to set the relative speed value of an animatableObject's Animation.
 * @param animatableObject the object of which's Animation you want to set the relative speed for.
 * @param speedValue an integer in the interval [1, 10] where speedValue 1 is 100% of the animation engines speed
 *  	  and speedValue x is (1/X * 100)% of the animation engine's speed.
 */
AnimationEngine.prototype.setSpeedValue = function(animatableObject, speedValue) {
	var animation = _getAnimation(animatableObject);

	if (animation === null) { //True if there is no Animation in the engine for given animatableObject.
		return;
	};
	animation.setSpeedValue(speedValue);
};

/**
 * Function to retrieve the relative speed value of an animatableObject's Animation.
 * @param animatableObject the object of which's Animation you want to retrieve the relative speed value from.
 * @returns -1 if the Animation does not exist in the engine, else the relative speed value.
 */
AnimationEngine.prototype.getSpeedValue = function(animatableObject) {
	var animation = _getAnimation(animatableObject);

	if (animation === null) { //True if the Animation does not exist within this engine.
		return -1;
	};
	return animation.getSpeedValue();
};

/**
 * Function to retrieve the speed, an interval in milliseconds, of an animatableObject's Animation.
 * @param animatableObject the object of which's Animation you want to retrieve the speed from.
 * @returns {Number} -1 if the Animation does not exist in the engine, else the speed value, in milliseconds.
 */
AnimationEngine.prototype.getSpeed = function(animatableObject) {
	var speedValue = this.getSpeedValue(animatableObject);

	if (speedValue === -1) { //True if the Animation, from which you want to retrieve the speed, does not exist within the engine.
		return -1;
	};
	return this.maximumSpeed * speedValue;
};

/**
 * Function to retrieve the speed, an interval in milliseconds, of this AnimationEngine.
 * @returns this AnimationEngine's speed, an interval in milliseconds.
 */
AnimationEngine.prototype.getEngineSpeed = function() {
	return this.maximumSpeed;
};

/**
 * Function to get the status about if an animatableObject's Animation is running or not.
 * @param animatableObject the animatableObject of which's Animation you want to get the running-status for.
 * @returns null if the Animation does not exist, true if the Animation is running and false if it is not.
 */
AnimationEngine.prototype.animationRunning = function(animatableObject) {
	var animation = _getAnimation(animatableObject);

	if (animation === null) { //True if the Animation does not exist within this engine.
		return null;
	};
	return animation.isRunning();
};


/**
 * Function to get the status about if this engine is running or not.
 * @returns {Boolean} true if this engine is running, false if not.
 */
AnimationEngine.prototype.engineRunning = function() {
	return this.engineRunning;
};

/**
 * Function called to start this engine.
 */
AnimationEngine.prototype.startEngine = function() {
	this.engineRunning = true;
	this.frameCounter = 0; //see constructor
	var t = this;
	this.engineTimerID = this.window.setInterval(function() { //We discovered that we seem to need a reference to window to call setInterval
		t._runEngine();
	}, this.maximumSpeed); //Starting a timer.
};

/**
 * Function called to stop this engine.
 */
AnimationEngine.prototype.stopEngine = function() { //Could be merged with startEngine.
	this.engineRunning = false;
	clearInterval(this.engineTimerID); //Terminates the timer.
};

/**
 * "Private" function used within the startEngine function to use in the spawned timers.
 */
AnimationEngine.prototype._runEngine = function() {// Do defensive programming
		
		for (var i = 0; i < this.layers.length; i++) { //Loop through the layers starting with the back one.
			var animations = this._getLayer(i).getAnimations();

			for (var k = 0; k < animations.length; k++) { //Loop through the Animations in the layer.

				if (animations[k].isRunning()
						&& (this.frameCounter % animations[k].getSpeedValue()) === 0) { //True if Animation is running and it is time to update it's state.
					animations[k].step();
				}
				//animations[k].draw(context); //Want to have a graphics manager who redraws instead, and just let the engine(s) "step" the Animations.
			}
		}
	this.frameCounter++;
};

/**
 * "Private" function used to retrieve the Animation related to an animatableObject.
 * @param animatableObject the given animatableObject used to retrieve it's Animation.
 * @returns null if the Animation does not exist, the Animation if it within this engine.
 */
AnimationEngine.prototype._getAnimation = function(animatableObject) {
	var layer = this._getLayer(this.getLayerIndex(animatableObject));
	if (layer !== null) { //True if the Animation exists within this engine.
		return layer.getAnimation(animatableObject);
	}
	return null;
};

/**
 * "Private" function to retrieve the AnimationLayer given the layer's index.
 * @param layerIndex the index of an AnimationLayer you want to retrieve.
 * @returns null if the AnimationLayer does not exist within this engine, else the AnimationLayer.
 */
AnimationEngine.prototype._getLayer = function(layerIndex) {
	if (layerIndex >= 0 && layerIndex < this.layers.length) { //True if the layerIndex is within the range of the layers.
		return this.layers[layerIndex];
	}
	return null;
};
