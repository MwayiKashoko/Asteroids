//Add small and large saucers and add a life every 2000 points
const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const pi = Math.PI;

let bullets = [];

let asteroidNumber = 4;
let asteroids = [];

for (let i = 0; i < asteroidNumber; i++) {
	asteroids.push(new Asteroid(randInt(-width/2, width/2), randInt(-height/2, height/2), randInt(1, 2), randInt(1, 2), 50, true));
}

let lives = 3;
let score = 0;

let count = 0;

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let spacePressed = false;

graphics.translate(width/2, height/2);

let player = new Ship(0, 0);

document.addEventListener("keydown", function(key) {
	if (key.keyCode == 37) {
		leftPressed = true;
	} if (key.keyCode == 39) {
		rightPressed = true;
	} else if (key.keyCode == 38) {
		upPressed = true;
	} else if (key.keyCode == 32) {
		spacePressed = true;
	}
});

document.addEventListener("keyup", function(key) {
	if (key.keyCode == 37) {
		leftPressed = false;
	} 

	if (key.keyCode == 39) {
		rightPressed = false;
	} 

	if (key.keyCode == 38) {
		upPressed = false;
	} 

	if (key.keyCode == 32) {
		spacePressed = false;
	}
});

//Making sure the asteroids don't spawn on top of the player
for (let i = 0; i < asteroids.length; i++) {
	while (asteroids[i].hits(player)) {
		asteroids[i].x = randInt(-width/2, width/2);
		asteroids[i].y = randInt(-height/2, height/2);
	}
}

graphics.lineWidth = 2;

function draw() {
	graphics.clearRect(-width/2, -height/2, width, height);

	for (let i = 0; i < bullets.length; i++) {
		wrap(bullets[i]);
		bullets[i].draw();
		bullets[i].update();

		if (bullets[i].timeLeft < 0) {
			bullets.splice(i, 1);
		}
	}

	player.draw(player.x, player.y, player.r);

	//Center of the player
	/*graphics.fillStyle = "white";
	graphics.beginPath();
	graphics.arc(player.x, player.y, 2, 0, pi*2)
	graphics.closePath();
	graphics.fill(); */

	if (upPressed) {
		player.thrust();
	}

	if (leftPressed) {
		player.rotate(1);
	} else if (rightPressed) {
		player.rotate(0);
	}

	//So that means there is a max of 4 bullets on the screen
	if (spacePressed && player.timeLeftUntilShoot <= 0 && bullets.length < 4) {
		bullets.push(new Bullet(player.x, player.y, player.angle));
		player.timeLeftUntilShoot = 10;
	}

	player.timeLeftUntilShoot--;
	player.gracePeriod--;

	wrap(player);
	player.move();
	
	for (let i = 0; i < asteroids.length; i++) {
		asteroids[i].draw();
		asteroids[i].update();
		wrap(asteroids[i]);

		if (player.gracePeriod <= 0) {
			if (asteroids[i].hits(player)) {
				lives--;
				player.gracePeriod = 100;
				player.x = 0;
				player.y = 0;
				player.angle = 0;
			}
		}

		for (let j = 0; j < bullets.length; j++) {
			if (asteroids[i].hits(bullets[j])) {
				score += 20;

				if (asteroids[i].r > 12.5) {
					asteroids[i].velX *= 1.1;
					asteroids[i].velY *= 1.1;
					asteroids[i].r /= 2;

					asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, -asteroids[i].velX, -asteroids[i].velY, asteroids[i].r, false));
				} else {
					asteroids.splice(i, 1);
				}

				bullets.splice(j, 1);

				break;
			}
		}
	}

	if (asteroids.length == 0) {
		lives++;

		asteroidNumber++;

		for (let i = 0; i < asteroidNumber; i++) {
			asteroids.push(new Asteroid(randInt(-width/2, width/2), randInt(-height/2, height/2), randInt(1, 2), randInt(1, 2), 50, true));
		}
	}

	graphics.font = "30px sans-serif";
	graphics.strokeStyle = "white";
	graphics.strokeText("Score: " + score, 10-width/2, 30-height/2);
	graphics.strokeText("Lives: " + lives, 10-width/2, 60-height/2);

	if (lives <= 0) {
		alert("YOU LOSE!");

		bullets = [];

		asteroidNumber = 4;
		asteroids = [];

		for (let i = 0; i < asteroidNumber; i++) {
			asteroids.push(new Asteroid(randInt(-width/2, width/2), randInt(-height/2, height/2), randInt(1, 2), randInt(1, 2), 50, true));
		}

		lives = 3;
		score = 0;

		count = 0;

		leftPressed = false;
		rightPressed = false;
		upPressed = false;
		spacePressed = false;

		player = new Ship(0, 0);

		for (let i = 0; i < asteroids.length; i++) {
			while (asteroids[i].hits(player)) {
				asteroids[i].x = randInt(-width/2, width/2);
				asteroids[i].y = randInt(-height/2, height/2);
			}
		}
	} 
}

function update() {
	draw();

	requestAnimationFrame(update);
}

update();