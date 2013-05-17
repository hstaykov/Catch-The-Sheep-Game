var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


var url = "https://killthesheep.firebaseio.com/";
var firebaseRef = new Firebase(url);

var playerName = "";
var startGame = false;
   firebaseRef.on("value", function(snap) {
   	var obj = (JSON.stringify(snap.val()));
   	$("#result").append(obj);
});
$("#nameForm").keyup(function (e) {
    if (e.keyCode == 13) {
     playerName = document.getElementById("nameForm").value;
     $("#nameForm").remove();
     $("#results").remove();
     startGame = true;
    }
});


var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/background.jpg";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "img/dwarf-right.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "img/sheep.png";



var fireReady = false;
var fireImage = new Image();
fireImage.onload = function () {
	fireReady = true;
};
fireImage.src = "img/axe.png";

var fire = {};

var hero = {
	speed: 256,
	position: "right" 
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

	moveLeft = true;
	moveUp = true;
	moveDown = true;
 	moveRight = true;
 	fireNow = false;

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	fire.x = hero.x;
	fire.y = canvas.height; 

	monster.x = 32 + (Math.random() * (canvas.width - 128));
	monster.y = 32 + (Math.random() * (canvas.height - 128));
};



var fireWeapon = function(mod, heroX, heroY) {
	fire.y = heroY;

	if (hero.position == "right")
		fire.x += (heroX + 1000) * mod;
	else if (hero.position == "left")
		fire.x -= (heroX + 1000) * mod;
	
	if (fire.x >= canvas.width || fire.x <= 0 )
	{
		fire.x = hero.x;
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
		heroImage.src = "img/dwarf-left.png";
		hero.position = "left";
	}
	if (39 in keysDown && moveRight) {
		hero.x += hero.speed * modifier;
		moveLeft = true;
		heroImage.src = "img/dwarf-right.png";
		hero.position = "right";
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
		var userScoreRef = firebaseRef.child(playerName);
		userScoreRef.setWithPriority({ name:playerName, score:monstersCaught }, monstersCaught);
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


	if (heroReady && startGame) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady && startGame) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (fireReady && startGame) {
		ctx.drawImage(fireImage, fire.x, fire.y);
	}

	ctx.fillStyle = "rgb(0, 50, 150)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText( playerName + " killed " + monstersCaught + " sheeps", 132, 32);

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