function Area() {
	/*      user
	 *     /    \
	 *    /      \
	 *   /        \
	 * left ---- right
	 */

	/**
	 * Area borders
	 * @type {{user: {lat: number, lon: number}, left: {lat: number, lon: number}, right: {lat: number, lon: number}}}
	 */
	this.position = {
		user : {
			lat: 0.0,
			lon: 0.0
		},
		left : {
			lat: 0.0,
			lon: 0.0
		},
		right : {
			lat: 0.0,
			lon: 0.0
		}
	};

	this.angle = 0.0;

	this.lat30km = 0.41;
	this.lon30km = 0.3075;
}

Area.prototype = {
	/**
	 * @param lat number Latitude position of user
	 * @param lon number Latitude position of user
	 * @param angleFromNorthClockWise number Position of angle from north in clockwise
	 */
	setUserPosition: function (lat, lon, angleFromNorthClockWise) {
		this.position.user.lat = lat;
		this.position.user.lon = lon;
		this.angle = angleFromNorthClockWise;

		var myLeft = this.rotate(lat, lon, lat + this.lat30km, lon + this.lon30km, angleFromNorthClockWise);
		this.position.left.lat = myLeft.x;
		this.position.left.lon = myLeft.y;

		var myRight = this.rotate(lat, lon, lat + this.lat30km, lon - this.lon30km, angleFromNorthClockWise);
		this.position.right.lat = myRight.x;
		this.position.right.lon = myRight.y;

		console.log(this)
	},

	/**
	 * Determine if a point is in a space
	 * @param lat number Position to test
	 * @param lon number Position to test
	 * @returns {boolean}
	 */
	isInTriangle: function (lat, lon) {
		var sign = function(x1, y1, x2, y2, x3, y3) {
			return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
		};

		var myB1, myB2, myB3;

		myB1 = sign(lat, lon, this.position.user.lat, this.position.user.lon, this.position.left.lat, this.position.left.lon) < 0.0;
		myB2 = sign(lat, lon, this.position.left.lat, this.position.left.lon, this.position.right.lat, this.position.right.lon) < 0.0;
		myB3 = sign(lat, lon, this.position.right.lat, this.position.right.lon, this.position.user.lat, this.position.user.lon) < 0.0;

		return ((myB1 == myB2) && (myB2 == myB3));
	},

	/**
	 * Private
	 * @param cx number Center X
	 * @param cy number Center Y
	 * @param x number Point to move
	 * @param y number Point to move
	 * @param angle number In degrees
	 * @returns {{x: *, y: *}}
	 */
	rotate: function(cx, cy, x, y, angle) {
		var radians = (Math.PI / 180) * angle,
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
			ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
		return {x: nx, y: ny};
	}
};

/**
 var myArea = new Area();
 myArea.setUserPosition(49.489122,0.098169, 0);

 myArea.position = {
		user : {
			lat: 0.0,
			lon: 0.0
		},
		left : {
			lat: 3,
			lon: 3
		},
		right : {
			lat: 3,
			lon: -3
		}
	};

 myArea.isInTriangle(2, 0);
 */
