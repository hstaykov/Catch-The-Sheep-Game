var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://digital-art-gallery.com/oid/50/640x548_9637_Battle_Background_Field_2d_landscape_game_art_forest_trees_picture_image_digital_art.jpg";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "http://www.adiumxtras.com/images/pictures/wow_dwarven_warrior_dock_icons_331063_img_1245.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "http://images3.wikia.nocookie.net/__cb20121011204428/farmville2/images/6/69/White_Sheep.png";



var fireReady = false;
var fireImage = new Image();
fireImage.onload = function () {
	fireReady = true;
};
fireImage.src = "http://img.oac-head.com/oac/img/items/icon_weapon_ge_axe_0004_golden.png";

var fire = {};

var hero = {
	speed: 256 
};
var monster = {};
var monstersCaught = 0;

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	fire.x = 0;
	fire.y = canvas.height; 

	monster.x = 32 + (Math.random() * (canvas.width - 128));
	monster.y = 32 + (Math.random() * (canvas.height - 128));
};



var fireWeapon = function(mod, heroX, heroY) {
	fire.y = heroY;

	fire.x += (heroX + 1000) * mod;
	if (fire.x >= canvas.width)
	{
		fire.x = 0;
		fire.y = canvas.height;
		fireNow = false;
	}

	if (
		fire.x <= (monster.x + 64)
		&& monster.x <= (fire.x + 64)
		&& fire.y <= (monster.y + 64)
		&& monster.y <= (fire.y + 64)
	) {
		++monstersCaught;
		reset();		
	}
}


var moveLeft = true;
var moveUp = true;
var moveDown = true;
var moveRight = true;
var fireNow = false;
var update = function (modifier) {
	

	if(fireNow){
		var x = hero.x;
		var y = hero.y;	
		fireWeapon(modifier, x, y);
	}
	if (38 in keysDown && moveUp) {
		hero.y -= hero.speed * modifier;
		moveDown = true;
	}
	if (40 in keysDown && moveDown) {
		hero.y += hero.speed * modifier;
		moveUp = true;
	}
	if (37 in keysDown && moveLeft) {
		hero.x -= hero.speed * modifier;
		moveRight = true;
	}
	if (39 in keysDown && moveRight) {
		hero.x += hero.speed * modifier;
		moveLeft = true;
	}

	if (32 in keysDown) {
		fireNow = true;
	}	

	if (
		hero.x <= (monster.x + 64)
		&& monster.x <= (hero.x + 64)
		&& hero.y <= (monster.y + 64)
		&& monster.y <= (hero.y + 64)
	) {
		++monstersCaught;
		reset();		
	}

	if (hero.x <= 0)
		moveLeft = false;
	if (hero.y <= 75)
		moveUp = false;
	if (hero.y >= 357)
		moveDown = false;
	if (hero.x >= 388)
		moveRight = false;
};

var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (fireReady) {
		ctx.drawImage(fireImage, fire.x, fire.y);
	}

	ctx.fillStyle = "rgb(0, 50, 150)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Sheeps killed: " + monstersCaught, 132, 32);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillText("X: " + hero.x.toFixed(2), 480, 400);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillText("Y: " + hero.y.toFixed(2) , 480, 430);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillText("fire Y: " + fire.y.toFixed(2) , 480, 450);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "bottom";
	ctx.fillText("fire X: " + fire.x.toFixed(2) , 480, 480);
};

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

reset();
var then = Date.now();
setInterval(main, 1); 