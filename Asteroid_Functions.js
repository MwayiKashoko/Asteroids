function randInt(min, max) {
	return Math.floor(Math.random()*(max-min+1))+min;
}

function sign(num) {
	if (num == 1) {
		return 1;
	} else if (num == 0) {
		return -1;
	}
}

function dist(x1, y1, x2, y2) {
	const x = x1-x2;
	const y = y1-y2;

	return Math.sqrt(x**2+y**2);
}

function wrap(object) {
	if (object.x-object.r > width/2) {
		object.x = -width/2-object.r;
	} else if (object.x+object.r < -width/2) {
		object.x = width/2+object.r;
	}

	if (object.y-object.r > height/2) {
		object.y = -height/2-object.r;
	} else if (object.y+object.r < -height/2) {
		object.y = height/2+object.r;
	}
}

function Ship(x, y) {
	this.x = x;
	this.y = y;
	this.r = 16;
	this.angle = 0;
	this.thrustAngle = 0;
	this.maxSpeed = 5;
	this.velX = 0;
	this.velY = 0;
	this.rotateSpeed = 0.1;
	this.timeLeftUntilShoot = 0;
	this.gracePeriod = 0;
}

Ship.prototype.draw = function() {
	graphics.save();
	graphics.strokeStyle = "white";
	graphics.beginPath();
	graphics.translate(this.x, this.y);
	graphics.rotate(this.angle);
	graphics.moveTo(-this.r, this.r);
	graphics.lineTo(0, -this.r);
	graphics.lineTo(this.r, this.r);
	graphics.closePath();
	graphics.stroke();
	graphics.restore();
}

Ship.prototype.rotate = function(dir) {
	if (dir) {
		this.angle -= this.rotateSpeed;
	} else {
		this.angle += this.rotateSpeed;
	}
}

Ship.prototype.thrust = function() {
	if (dist(this.velX, this.velY, 0, 0) < this.maxSpeed) {
		this.velX += 1;
		this.velY += 1;
		this.thrustAngle = this.angle
	}
}

Ship.prototype.move = function() {
	const decay = 0.95;

	this.x += this.velX*Math.sin(this.thrustAngle);
	this.y -= this.velY*Math.cos(this.thrustAngle);

	this.velX *= decay;
	this.velY *= decay;
}

function Bullet(x, y, angle) {
	this.x = x;
	this.y = y;
	this.r = 2;
	this.angle = angle;
	this.timeLeft = 50;
}

Bullet.prototype.draw = function() {
	graphics.fillStyle = "white";
	graphics.beginPath();
	graphics.arc(this.x, this.y, this.r, 0, 2*pi);
	graphics.closePath();
	graphics.fill();
}

Bullet.prototype.update = function() {
	this.timeLeft--;

	this.x += 3*Math.sin(this.angle);
	this.y -= 3*Math.cos(this.angle);
}

function Asteroid(x, y, velX, velY, r, originalAsteroid) {
	this.x = x;
	this.y = y;

	if (originalAsteroid) {
		this.velX = sign(randInt(0, 1))*velX;
		this.velY = sign(randInt(0, 1))*velY;
	} else {
		this.velX = velX;
		this.velY = velY;
	}

	this.r = r;
	this.sides = randInt(10, 20);
	this.offsetX = [];
	this.offsetY = [];

	for (let i = 0; i < this.sides-1; i++) {
		this.offsetX.push(randInt(-10, 10));
		this.offsetY.push(randInt(-10, 10));
	}
}

Asteroid.prototype.draw = function() {
	graphics.strokeStyle = "white";
	graphics.beginPath();

	graphics.moveTo(this.x+this.r+this.offsetX[0], this.y);
	//graphics.moveTo(this.x+this.r, this.y);

	for (let i = 1; i < this.sides; i++) {
		const newX = this.r*Math.cos(2*i*pi/this.sides);
		const newY = -this.r*Math.sin(2*i*pi/this.sides);

		graphics.lineTo(this.x+newX+this.offsetX[i], this.y+newY+this.offsetY[i]);
		//graphics.lineTo(this.x+newX, this.y+newY);
	}

	graphics.closePath();
	graphics.stroke();
}

Asteroid.prototype.update = function() {
	this.x += this.velX;
	this.y += this.velY;
}

Asteroid.prototype.hits = function(object) {
	if (dist(this.x, this.y, object.x, object.y) < this.r+object.r) {
		return true;
	}
}