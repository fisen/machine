/**
 * This class represents a GearMachine: it's a machine with many gears. It can
 * be be started or stopped.
 * 
 * @Author Magnus Larsson, Marco Dondio
 */

function GearMachine() {// Create neighbor gear matrix using associative-array

	this.active = false; // machine starts in off mode
	this.speed = 1; // default speed

	this.startingGear = null; // starting gear for movement
	this.gears = new Array(); // contains gears
	this.gearMatrix = new Array(); // contains gear relationship
	this.gearSpinDirections = new Array(); // gear directions: 1, 0, -1
	this.removedGears = new Array();

};

// "tolerance" to decide wheter gear attach or not
GearMachine.prototype.ATTACH_TOLERANCE = 10;

// Enum type for gear relationship
GearMachine.prototype.GearRelation = Object.freeze({
	"OVERLAP" : 1,
	"NEIGHBOUR" : 2,
	"FAR" : 3
});

// //////////////////////////////////////////////////

// NOTE: first gear added to the system is the "active one"
// It will start spinning clockwise

// TODO optimize
/**
 * This method is called when a gear is dropped in the workspace. Returns true
 * if gear correctly positioned, false otherwise.
 * 
 * @param the
 *            gear to place
 * @return true if gear could be placed, false otherwise.
 */

GearMachine.prototype.placeGear = function(gear) {

	if (arguments.length != 1 || getObjectClass(gear) != "Gear")
		return false;

	// First we retrieve all neighbours: gears that connected
	// we may have stuck exception or overlap exception
	var neighbInfo;
	try {
		neighbInfo = this._getGearNeighboursInfo(gear);
	} catch (err) {
		throw err;
	}
	// Calculate spins: can throw an exception if a free wheel
	// cluster which cant spin is created
	try {
		this._setSpinDirections(gear, neighbInfo);
	} catch (err) {
		throw err;
	}

	// then for graphical alignment, translate a bit gear, maybe rotate
	// purpose is to make this wheel more "attached to neighbour"
	// TODO
	gear = this._alignGear(gear, neighbInfo);

	// Finally add gear to system and setup connections
	this._setupConnections(gear, neighbInfo);
	return true;
};

/**
 * This function is called when a gear is removed from the system
 * 
 * @param gear
 *            the gear to be removed
 */
GearMachine.prototype.removeGear = function(gear) {

	// Check if gear is in the system
	// TODO: for the moment u cant remove starting gear
	var index = this.gears.indexOf(gear);
	if (index === -1 || gear === this.startingGear)
		return false;

	// Remove from the system
	this.gears.splice(index, 1);

	// Remove gearMatrix row
	delete this.gearMatrix[gear]; // will mark entry as undefined, not

	// Now remove cols
	for ( var g in this.gearMatrix)
		delete this.gearMatrix[g][gear];

	// Delete spin dir
	delete this.gearSpinDirections[gear];

	// Set spin to 0 for all and traverse again
	for ( var g in this.gearSpinDirections)
		this.gearSpinDirections[g] = 0;

	// Assign again spindirections from the starting gear
	var isTraversed = new Array();
	this._propagateSpin(1, this.startingGear, isTraversed);
};

/**
 * This function is called by the animation manager. It will run the machine
 * simulation
 */
GearMachine.prototype.step = function() {

	if (!this.active) // turned off
		return;

	for ( var i = 0; i < this.gears.length; i++) {
		var g = this.gears[i];

		var dir = this.gearSpinDirections[g];

		g.rotate((this.speed * dir));
	}
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
		// this.gears[i].drawOLD(ctx);
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

/**
 * For debugging
 */
GearMachine.prototype.printMatrix = function() {

	var s = "";
	for ( var row in this.gearMatrix) {
		s += row + " -> ";

		for ( var col in this.gearMatrix[row])
			s += this.gearMatrix[row][col] + "  ";

		// s += col + " (" + this.gearMatrix[row][col] +")";

		s += "\n";

	}

};

/**
 * This function retrieves the gear which contains the passed point
 * 
 * @param XPos
 *            x coordinate
 * @param YPos
 *            y coordinate
 * 
 * @return a gear, null if no gear found
 */
GearMachine.prototype.getGearAt = function(XPos, YPos) {

	for ( var i = 0; i < this.gears.length; i++) {
		var g = this.gears[i];

		// Get dist from gear center to clicked point
		var dist = euclideanDist(XPos, YPos, g.getXPos(), g.getYPos());

		// If distance is below radius we clicked "inside": return g
		if (dist < g.getOuterRadius())
			return g;
	}

	// Else no gear found
	return null;
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

// This functions return an array containing all neighbour for the passed gear
// may throw stuck exception, overlap exception
GearMachine.prototype._getGearNeighboursInfo = function(gear) {

	var neighbList = new Array(); // contains neighbour
	var neighbSpinDir = 0; // neighbour spin direction

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
			throw "gear " + gear + ": Overlapping gear exception"; // no
		// placement

		// If neighbour add to neighbours list: will consider later
		// we put also distance
		if (gearRelation === this.GearRelation.NEIGHBOUR) {

			// get g spin
			var gSpin = this.gearSpinDirections[g];

			// debug
			// alert(gear + " neighbour with " + g);

			// All neighbours must spin in same direction
			if (gSpin !== 0) { // only if g has a direction..
				if (neighbSpinDir === 0)
					neighbSpinDir = gSpin; // set spin
				else if (neighbSpinDir !== gSpin) // check for invalid spin
					throw "gear " + gear + ": Machine stuck exception";
			}

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

	// Return both neighbours and valid spin direction
	var neighbInfo = {
		list : neighbList,
		spinDir : neighbSpinDir
	};

	return neighbInfo;
};

// This function tries to assign spin to gear and his neighbours
// can throw exception if system cant spin
GearMachine.prototype._setSpinDirections = function(gear, neighbInfo) {

	// If one wheel only, fixed spinning direction
	if (this.gears.length === 0) {
		this.gearSpinDirections[gear] = 1;
		this.startingGear = gear;
	} else if (neighbInfo.list.length === 0) // stuck wheel, no neighbour
		this.gearSpinDirections[gear] = 0;
	else if (neighbInfo.spinDir === 0) // all free neighbours
	{
		// here i must check if this cluster of free wheels can spin
		// after im adding this wheel

		var assignedDirs = new Array();
		assignedDirs[gear] = 1; // assign a spin

		try {
			for ( var i = 0; i < neighbInfo.list.length; i++) {
				var g = neighbInfo.list[i].gear;
				this._isValidFreeChain(-assignedDirs[gear], g, assignedDirs);
			}
		} catch (err) {
			throw err;
		}

		// If im here this free "cluster" is ok
		this.gearSpinDirections[gear] = 0;

	} else // general case, neighbour list not empty:
	{

		this.gearSpinDirections[gear] = -neighbInfo.spinDir; // other
		// direction

		// Now for each neighbour not moving (because was not connected),
		// propagate spin. Note that we already checked before machine stuck
		// NOTE: propagate FROM gear to neighbours wich spinDir is 0: will
		// propagate recursively! Avoid cycles!

		var isTraversed = new Array();
		isTraversed[gear] = true;
		for ( var i = 0; i < neighbInfo.list.length; i++) {
			var g = neighbInfo.list[i].gear;

			// alert(gear + " has neighbour " + g + ", his spinDir is "
			// + this.gearSpinDirections[g]);

			if (this.gearSpinDirections[g] === 0) // not moving
				this._propagateSpin(neighbInfo.spinDir, g, isTraversed);
		}

	}
};

// This function propagates spin to stuck wheel only
GearMachine.prototype._propagateSpin = function(spinDir, gear, isTraversed) {

	if (isTraversed[gear])
		return;

	this.gearSpinDirections[gear] = spinDir;
	isTraversed[gear] = true;

	for (g in this.gearMatrix[gear]) {
		if (0 === this.gearMatrix[gear][g] || g == gear) // not connected
			continue;

		if (this.gearSpinDirections[g] === 0)
			this._propagateSpin(-spinDir, g, isTraversed);
	}

};

// This function checks if cluster of free (not connected to spinning ones)
// wheel get stuck after inserting one wheel
GearMachine.prototype._isValidFreeChain = function(spinDir, gear, assignedDirs) {

	// alert("_isValidFreeChain: spinDir = " + spinDir + ", gear = " + gear);
	if (assignedDirs[gear] === undefined) { // never touched
		assignedDirs[gear] = spinDir; // assign 1 or -1

		for (g in this.gearMatrix[gear]) { // note: g is string returned by
			// object gear

			// not connected
			if (0 === this.gearMatrix[gear][g] || g == gear) // note: g is
				// string, gear
				// obj
				continue;

			this._isValidFreeChain(-spinDir, g, assignedDirs);
		}
	} else // already touched
	{
		if (assignedDirs[gear] === spinDir)
			return;

		else
			throw "gear " + gear + ": free wheel cluster not valid!";
	}

};

// This function adds gear to the machine and setup needed connections
GearMachine.prototype._setupConnections = function(gear, neighbInfo) {

	// Add gear to the gearList if does not exists
	if (this.gears.indexOf(gear) === -1) {
		this.gears.push(gear); // add to this.gears list
		this.gearMatrix[gear] = new Array(); // add to this.gearMatrix...
	}
	// Now UNSET all previous connections
	for ( var g in this.gearMatrix) {
		this.gearMatrix[g][gear] = 0; // update gear column
		this.gearMatrix[gear][g] = 0; // update gear row
	}
	// Set diagonal (don't needed but looks more correct)
	this.gearMatrix[gear][gear] = 1;

	// Now SET all neighbour connections
	for ( var i = 0; i < neighbInfo.list.length; i++) {
		var g = neighbInfo.list[i].gear;

		this.gearMatrix[g][gear] = 1; // update gear column
		this.gearMatrix[gear][g] = 1; // update gear row
	}
};

// This function aligns graphically the gear to fit in a better way
// with respect to neighbours
GearMachine.prototype._alignGear = function(gear, neighbInfo) {

	// TODO modify gear XPos and YPos to fit in better way
	// with respect to neighbours!
	// gear.setXPos(gear.getXPos() ...);

	return gear;
};

/**Removes the last gear from the gears list. And store the removed gear in the 
 * removed Gear array.
*/
GearMachine.prototype.removeLastGear= function(){
	if(this.gears.length>1){
		this.removedGears[this.removedGears.length]=this.gears[this.gears.length-1];
		this.removeGear(this.gears[this.gears.length-1]);//(this.gears[this.gears.length-1]);
	}
};
/**
 * Put the gear
 */
GearMachine.prototype.redoRemovedGears= function(){
	if(this.removedGears.length>0){
		this.placeGear(this.removedGears[this.removedGears.length-1]);
		
		this.removedGears.pop();
		
		
	}
	
};


GearMachine.prototype._getClosestGear = function(xPos, yPos) {

};

GearMachine.prototype._getGear = function(xPos, yPos) {

};