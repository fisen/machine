/**
 * This class represents a GearMachine: it's a machine with many this.gears. It
 * can be be started or stopped.
 * 
 * @Author Magnus Larsson, Marco Dondio
 */

function GearMachine() {// Create neighbor gear matrix using associative-array

	this.active = false; // machine starts in off mode
	this.speed = 1; // default speed

	// TODO matrice vuota

	this.gears = new Array(); // contains this.gears
	this.gearMatrix = new Array(); // contains gear relationship

};

GearMachine.prototype.ATTACH_TOLERANCE = 2; // "tolerance" to decide wheter gear
// attach or not

// Enum type for gear relationship
// if (incommingEnum === DaysEnum.monday) //incommingEnum is monday

GearMachine.prototype.GearRelation = Object.freeze({
	"OVERLAP" : 1,
	"NEIGHBOUR" : 2,
	"FAR" : 3
});

// //////////////////////////////////////////////////

// NOTE: first gear added to the system is the "active one"
// It will start spinning clockwise

// NOTE: dragging wheel to new position only calls placeGear

/**
 * This method is called when a gear is dropped in the workspace. Returns true
 * if gear correctly positioned, false otherwise.
 * 
 * @param the
 *            gear to place
 * @return true if gear could be placed, false otherwise.
 */

// TODO refactor code.. i use only one method is faster now
GearMachine.prototype.placeGear = function(gear) {

	if (arguments.length != 1 || getObjectClass(gear) != "Gear")
		return false;

	// Now for all gear in the machine check their relationship
	// we store thei neighbour in a data structure for later usage
	// list of pair
	var neighbList = new Array();

	// For each gear we check relationship with the placed one
	// NOTE we should skip if g = gear, means was already in system
	for ( var i = 0; i < this.gears.length; i++) { // NOTE: no foreach for
		// arrays
		var g = this.gears[i];

		if (gear === g) // If gear was already in system dont check
			continue;

		// Now test the relationship
		var gearRelation = this._getGearRelation(gear, g);

		// If overlap, abort placement
		if (gearRelation === this.GearRelation.OVERLAP)
			return false; // no placement

		// If neighbour add to neighbours list: will consider later
		// we put also distance
		if (gearRelation === this.GearRelation.NEIGHBOUR) {

			// push pair: neighbour and distance
			var pair = {
				gear : g,
				dst : euclideanDist(gear.getXPos(), gear.getYPos(),
						g.getXPos(), g.getYPos())
			};
			neighbList.push(pair);
		}
	}
	// Now we sort the neighbList by dst ascending from the gear
	neighbList.sort(function(p0, p1) {
		return p0.dst - p1.dst;
	});

	// Add gear to the gearList if does not exists
	if (this.gears.indexOf(gear) === -1) {
		this.gears.push(gear); // add to this.gears list
		this.gearMatrix[gear] = new Array(); // add to this.gearMatrix...
	}

	// Now unset all previous connections
	for ( var g in this.gearMatrix) {
		this.gearMatrix[g][gear] = 0; // update gear column
		this.gearMatrix[gear][g] = 0; // update gear row
	}
	// Set diagonal (dont know if needed.. to be checked XXX)
	this.gearMatrix[gear][gear] = 1;

	// TODO define good policy for neighbours..
	// NOW: i just attach to the FIRST neighnour to be changed later

	if (neighbList.length > 0)
		this.gearMatrix[gear][neighbList[0].gear] = 1;
};

/**
 * This function is called when a gear is removed from the system
 * 
 * @param Gear
 *            the gear to be removed
 */
GearMachine.prototype.removeGear = function(Gear) {

	// stop system

	// delete gear from matrix
};

/**
 * This function is called by the animation manager. It will run the machine
 * simulation
 */
GearMachine.prototype.tick = function() {

	if (!this.active) // turned off
		return;

	// TODO now tutti uguali solo testing rapido
	for ( var i = 0; i < this.gears.length; i++)
		this.gears[i].rotate(this.speed);
};

/**
 * This function is called by the animation manager. It will run the machine
 * simulation
 */
GearMachine.prototype.draw = function(ctx) { // FOR NOW: we will pass a
	// canvas manager, it contains
	// offset, sizes, everything
	// needed

	// TODO for the moment i draw everything, no need to check if they are "in
	// view"
	for ( var i = 0; i < this.gears.length; i++)
		this.gears[i].draw(ctx);
};

/**
 * This function is called to start the machine
 */
GearMachine.prototype.start = function() {
	this.active = true;
};

/**
 * This function is called to stop the machine
 */
GearMachine.prototype.stop = function() {
	this.active = false;
};

/**
 * This function is called to retrieve the machine status.
 * 
 * @return status of machine
 */
GearMachine.prototype.isActive = function() {
	return this.active;
};

/**
 * Retrieve machine speed.
 * 
 * @return status of machine
 */
GearMachine.prototype.getSpeed = function() {
	return this.speed;
};

/**
 * Sets the speed of machine
 * 
 * @param speed
 *            of machine
 */
GearMachine.prototype.setSpeed = function(speed) {
	this.speed = speed;
};

// //////////////////////////////////////////////////

// "private methods"
// This method returns an enum, to check in wich status r the gears
GearMachine.prototype._getGearRelation = function(g0, g1) {

	// Get distance from centers
	var centerDist = euclideanDist(g0.getXPos(), g0.getYPos(), g1.getXPos(), g1
			.getYPos());

	// Now check if they are overlapping
	var g0Rad = g0.getOuterRadius();
	var g1Rad = g1.getOuterRadius();

	// if dst - b < a => overlap
	if ((centerDist - g1Rad) < g0Rad)
		return this.GearRelation.OVERLAP;

	// Else check if the can be considered neighbour:
	else if ((centerDist - g0Rad - g1Rad) < this.ATTACH_TOLERANCE)
		return this.GearRelation.NEIGHBOUR;

	else
		return this.GearRelation.FAR;
};

GearMachine.prototype._getClosestGear = function(xPos, yPos) {

};

GearMachine.prototype._getGear = function(xPos, yPos) {

};