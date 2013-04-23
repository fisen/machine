/**
 * Returns the class name of the argument or undefined if it's not a valid
 * JavaScript object.
 * 
 * http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
 * 
 * @param obj
 *            the object to test
 */
function getObjectClass(obj) {
	if (obj && obj.constructor && obj.constructor.toString) {
		var arr = obj.constructor.toString().match(/function\s*(\w+)/);

		if (arr && arr.length == 2) {
			return arr[1];
		}
	}

	return undefined;
}

////////////////////////////////////////////////////

/**
 * Simple euclidean distance.
 * 
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @returns
 */
function euclideanDist(x0, y0, x1, y1) {
	return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}