function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 150);
    this.radius = 150;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
	//nothing yet
}

Background.prototype.draw = function (ctx) {
	//nothing yet
}

function FireDog(game) {
     
	this.start = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 0, 50, 45, 0.15, 1, true, false);
  
    this.startdown = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 0, 50, 45, 0.15, 1, true, false);
	this.startup = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 150, 50, 45, 0.15, 1, true, false);
    this.startleft = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 50, 50, 45, 0.15, 1, true, false);
	this.startright = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 100, 50, 45, 0.15, 1, true, false);
	
	this.down = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 0, 50, 45, 0.15, 4, true, false);
    this.up = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 150, 50, 45, 0.15, 4, true, false);
    this.left = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 50, 50, 45, 0.15, 4, true, false);
    this.right = new Animation(ASSET_MANAGER.getAsset("./img/spriteFireDog.png"), 0, 100, 50, 45, 0.15, 4, true, false);
    
    this.wup = this.wdown = this.wleft = this.wright = false; 
	this.direction = 3;
	
    this.x = 150;
    this.y = 150;
    Entity.call(this, game, this.x, this.y);
}

FireDog.prototype = new Entity();
FireDog.prototype.constructor = FireDog;

FireDog.prototype.update = function () {
	if(this.game.k){
		this.shoot(); 
	}
	
    if (this.game.a) {
      this.wleft = true;
      this.x = this.x - 5;
    }
    else this.wleft = false;
    
    if (this.game.w) {
      this.wup = true;
      this.y = this.y - 5;
    }
    else this.wup = false;
    
    if (this.game.s) {
      this.wdown = true;
      this.y = this.y + 5;
    }
    else this.wdown = false;
    
    if (this.game.d) {
      this.wright = true;
      this.x = this.x + 5;
    }
    else this.wright = false;
	
    Entity.prototype.update.call(this);
}

FireDog.prototype.draw = function (ctx) {
    if (this.wdown) {
      this.down.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
	  this.start = this.startdown; 
	  this.direction = 3;
    }
    else if (this.wup) {
      this.up.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1); 
	  this.start = this.startup;
	  this.direction = 0;
    }
    else if (this.wleft) {
      this.left.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
	  this.start = this.startleft; 
	  this.direction = 2;
    }    
    else if (this.wright) {
      this.right.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
	  this.start = this.startright;
		this.direction = 1;
    }
    else {
        this.start.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
    }
    Entity.prototype.draw.call(this);
}

FireDog.prototype.shoot = function(){
	var fire = new Fireball(this.game, this.x, this.y, this.direction); 
	this.game.addEntity(fire); 
}

function Fireball(game, x, y, dir) {
	var facex = 50; 
	var facey = 60; 
    Entity.call(this, game, x + facex, y + facey, dir);
    this.shootAnimation = new Animation(ASSET_MANAGER.getAsset("./img/fireBall.png"), 0, dir*75, 75, 75, 0.15, 3, true, false);
	this.speed = 40; 
	this.distance = 200; 
	this.direction = dir;
}

Fireball.prototype = new Entity();
Fireball.prototype.constructor = Fireball;


Fireball.prototype.update = function() {
    if (this.outsideScreen()) {
        this.removeFromWorld = true;
    } else {
		if (this.direction == 0) this.y -= 10;
		else if (this.direction == 3) this.y += 10;
		else if (this.direction == 2) this.x -= 10;
		else if (this.direction == 1) this.x+= 10;
		this.distance += this.speed * this.game.clockTick; 
    }}
Entity.prototype.outsideScreen = function() {
    return (this.x > 500 || this.x < -(500) ||
        this.y > 500 || this.y < -(500));
}

Fireball.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
	
	if(this.game.a || this.start == this.startleft){
    ctx.rotate(Math.PI/2);
	
	}
	if(this.game.w || this.start == this.startup){
	ctx.rotate(Math.PI); 
	}
	if(this.game.d || this.start == this.startright) {
	ctx.rotate(3*(Math.PI/2));
	}
    ctx.translate(-this.x, -this.y);
    this.shootAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .7);
    ctx.restore();
    
    Entity.prototype.draw.call(this, ctx);
}
// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/spriteFireDog.png");
ASSET_MANAGER.queueDownload("./img/fireBall.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var firedog = new FireDog(gameEngine);
    var fireball = new Fireball(gameEngine); 

    gameEngine.addEntity(bg);
    gameEngine.addEntity(firedog);
	gameEngine.addEntity(fireball); 
 
    gameEngine.init(ctx);
    gameEngine.start();
});
