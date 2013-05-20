var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
var axes = 50;

var userIp;

var url = "https://killthesheep.firebaseio.com/";
var firebaseRef = new Firebase(url);

var playerName = "";
var startGame = false;

$("#nameForm").keyup(function (e) {
    if (e.keyCode == 13) {
     playerName = document.getElementById("nameForm").value;
     $("#nameForm").hide();
     $("#results").hide();
     startGame = true;
    }
});


$.get("http://jsonip.appspot.com", function(data){
			userIp = data.ip;
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

var аmmoReady = false;
var ammoImage = new Image();
ammoImage.onload = function () {
	аmmoReady = true;
};
ammoImage.src = "img/ammo.png";


var trollReady = false;
var trollImage = new Image();
trollImage.onload = function () {
	trollReady = true;
};
trollImage.src = "img/troll.gif";

var trollHealthBarReady = false;
var trollHealthBarImage = new Image();
trollHealthBarImage.onload = function () {
	trollHealthBarReady = true;
};
trollHealthBarImage.src = "img/fullHealth.png";

var troll = {
	speed: 64,
	x: canvas.width,
	y: canvas.height,
	health: 2
};

var trollHealthBar = {
	x: troll.x,
	y: troll.y + 20
}

var ammo ={

}

var fire = {};

var hero = {
	speed: 256,
	position: "right",
	x: canvas.width / 2,
	y: canvas.height / 2 
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


var resetGame = function(){

	// $("#score").fadeOut("fast");

	// $("#score").fadeIn(1500);
	// $("#score").text("Game over! Sheeps: " + monstersCaught);



	$("#nameForm").fadeIn(1500);
    $("#results").fadeIn(1500);

	startGame = false;

	axes = 50;

	troll.health = 2;
	troll.speed = 64;
	trollHealthBarImage.src = "img/fullHealth.png";

	monstersCaught = 0;
	
	deployTroll();

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
}


var deployTroll = function(){
	var trollStartPoint = Math.floor((Math.random()*4)+1);
	switch(trollStartPoint){
		case 1:
			troll.x = canvas.width;
			troll.y = canvas.height;
			break;
		case 2:
			troll.x = canvas.width;
			troll.y = 0;
			break;
		case 3:
			troll.x = 0;
			troll.y = canvas.height;
			break;
		case 4:
			troll.x = 0;
			troll.y = 0;
			break;
	}
}

var deployAmmo = function() {
	if (startGame){
	аmmoReady = true;
	console.log("Ammo");
	ammo.x = 52 + (Math.random() * (canvas.width - 128));
	ammo.y = 102 + (Math.random() * (canvas.height - 256));
	}
}	

var reset = function () {
	
	moveLeft = true;
	moveUp = true;
	moveDown = true;
 	moveRight = true;
 	fireNow = false;

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
		axes--;
	}

	if (
		fire.x <= (monster.x + 64)
		&& monster.x <= (fire.x + 64)
		&& fire.y <= (monster.y + 64)
		&& monster.y <= (fire.y + 64)
	) {
		++monstersCaught;
		fireNow = false;
		axes--;
		reset();		
	}

	if (
		fire.x <= (troll.x + 64)
		&& troll.x <= (fire.x + 64)
		&& fire.y <= (troll.y + 64)
		&& troll.y <= (fire.y + 64)
	) {
		if(troll.health == 2){
			trollHealthBarImage.src = "img/halflHealth.png";
			--troll.health;
			fire.x = hero.x;
			fire.y = canvas.height;
			axes--; 
			fireNow = false;
		}
		else if (troll.health == 1)
		{
			trollHealthBarImage.src = "img/nolHealth.png";
			--troll.health;
			fire.x = hero.x;
			fire.y = canvas.height;
			axes--;
			fireNow = false; 	
		}
		else if (troll.health == 0)
		{
			trollHealthBarImage.src = "img/fullHealth.png";
			troll.health = 2;
			deployTroll();
			fire.x = hero.x;
			fire.y = canvas.height;
			axes--;
			fireNow = false; 
		}
	}
}


var movingTroll = function (mod){
	
		if (hero.x <= troll.x)
			troll.x -= troll.speed * mod;
		else
			troll.x += troll.speed * mod;
		if (hero.y <= troll.y)
			troll.y -= troll.speed * mod;
		else
			troll.y += troll.speed * mod;
		trollHealthBar.x = troll.x + 20;
		trollHealthBar.y = troll.y - 10;
}


var calcGameLevel = function(){
	if (monstersCaught%10 == 9)
	{
		troll.speed += 10;
		++monstersCaught;
	}
}



var moveLeft = true;
var moveUp = true;
var moveDown = true;
var moveRight = true;
var fireNow = false;
var update = function (modifier) {
	
	movingTroll(modifier);
	calcGameLevel();


	if(fireNow && axes > 0 ){
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
		if (hero.position == "right")
			heroImage.src = "img/dwarf-left.png";
		hero.position = "left";
	}
	if (39 in keysDown && moveRight) {
		hero.x += hero.speed * modifier;
		moveLeft = true;
		if(hero.position == "left")
			heroImage.src = "img/dwarf-right.png";
		hero.position = "right";
	}

	if (32 in keysDown) {
		fireNow = true;
	}	

	//Checking for sheep collision
	if (
		hero.x <= (monster.x + 64)
		&& monster.x <= (hero.x + 64)
		&& hero.y <= (monster.y + 64)
		&& monster.y <= (hero.y + 64)
	) {
		++monstersCaught;
		reset();		
	}

	// Checking for troll collision
	if (
		hero.x <= (troll.x + 64)
		&& troll.x <= (hero.x + 64)
		&& hero.y <= (troll.y + 64)
		&& troll.y <= (hero.y + 64)
	) {
		var userScoreRef = firebaseRef.child(playerName);
		userScoreRef.setWithPriority({ name:playerName, score:monstersCaught, time:getCurrentTime(), ip: userIp }, monstersCaught);
		resetGame();		
	}

	// Checking for ammo collision
	if (
		hero.x <= (ammo.x + 64)
		&& ammo.x <= (hero.x + 64)
		&& hero.y <= (ammo.y + 32)
		&& ammo.y <= (hero.y + 100)
	) {
		axes += 10;
		ammo.x = 0;
		ammo.y = 0;
		аmmoReady = false;
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

	if (trollReady && startGame) {
		ctx.drawImage(trollImage, troll.x, troll.y);
	}

	if (trollHealthBarReady && startGame) {
		ctx.drawImage(trollHealthBarImage, trollHealthBar.x, trollHealthBar.y);
	}

	if (аmmoReady && startGame) {
		ctx.drawImage(ammoImage, ammo.x, ammo.y);
	}



	if (startGame){
	$("#sheepsKilled").text(monstersCaught);
	$("#ammoLeft").text(axes);
	}

	
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
	ctx.fillText("trol speed : " + troll.speed.toFixed(2) , 480, 480);
};

var main = function () {
	var now = Date.now();
	var delta = now - then;

	if (startGame)
	update(delta / 1000);
	
	render();
	
	then = now;

};

reset();
var then = Date.now();

setInterval(deployAmmo, 15000); 
setInterval(main, 1); 


var getCurrentTime = function(){
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();

	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10)
	minutes = "0" + minutes;
	
	return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}
	


    // function getip(json){
    //   alert(json.ip); 
    // }

// <script type="application/javascript" src="http://jsonip.appspot.com/?callback=getip"></script>