var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = Zepto;
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
        return window.setTimeout(callback, 1000 / 60);
    };
})();
$(function () {
    var game = new Game;
    game.run();
});
var SpriteImage = (function () {
    function SpriteImage() {
        var _this = this;
        this.ready = false;
        this.url = "images/sheet.png";
        var image = new Image();
        image.src = this.url;
        image.onload = function () {
            _this.ready = true;
        };
        this.image = image;
    }
    return SpriteImage;
})();
var Sprite = (function () {
    function Sprite(world) {
        this.world = world;
        this.sourceX = 0;
        this.sourceY = 0;
        this.sourceWidth = 0;
        this.sourceHeight = 0;
        this.destinationX = 0;
        this.destinationY = 0;
        this.destinationWidth = 0;
        this.destinationHeight = 0;
        this.x = 0;
        this.y = 0;
        this.image = new SpriteImage;
        this.collidable = false;
    }
    Sprite.prototype.drawImage = function (sx, sy, dx, dy) {
        if (this.image.ready) {
            this.world.ctx.drawImage(this.image.image, sx, sy, this.sourceWidth, this.sourceHeight, dx, dy, this.destinationWidth, this.destinationHeight);
        }
    };
    return Sprite;
})();
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity() {
        _super.apply(this, arguments);
    }
    Entity.prototype.draw = function () {
        if (this.world.atViewLimitLeft()) {
            this.destinationX = this.x;
        }
        if (this.world.atViewLimitTop()) {
            this.destinationY = this.y;
        }
        if (this.world.atViewLimitRight()) {
            this.destinationX = this.x - this.world.viewWidthLimit();
        }
        if (this.world.atViewLimitBottom()) {
            this.destinationY = this.y - this.world.viewHeightLimit();
        }
        this.drawImage(this.sourceX, this.sourceY, this.destinationX, this.destinationY);
    };
    return Entity;
})(Sprite);
var Background = (function (_super) {
    __extends(Background, _super);
    function Background(world) {
        _super.call(this, world);
        this.destinationWidth = world.viewWidth;
        this.destinationHeight = world.viewHeight;
        this.sourceWidth = world.viewWidth;
        this.sourceHeight = world.viewHeight;
    }
    Background.prototype.draw = function () {
        var x = this.world.hero.x - this.world.heroViewOffsetX();
        var y = this.world.hero.y - this.world.heroViewOffsetY();
        if (this.world.atViewLimitLeft()) {
            var x = 0;
        }
        if (this.world.atViewLimitTop()) {
            var y = 0;
        }
        if (this.world.atViewLimitRight()) {
            var x = this.world.viewWidthLimit();
        }
        if (this.world.atViewLimitBottom()) {
            var y = this.world.viewHeightLimit();
        }
        this.drawImage(x, y, this.destinationX, this.destinationY);
    };
    return Background;
})(Sprite);
var InputHandler = (function () {
    function InputHandler(world) {
        var _this = this;
        this.world = world;
        this.keysDown = {};
        $("body").keydown(function (e) {
            _this.keysDown[e.keyCode] = true;
        });
        $("body").keyup(function (e) {
            delete _this.keysDown[e.keyCode];
        });
    }
    InputHandler.prototype.update = function (modifier) {
        if (38 in this.keysDown) {
            this.world.up(modifier);
        }
        if (40 in this.keysDown) {
            this.world.down(modifier);
        }
        if (37 in this.keysDown) {
            this.world.left(modifier);
        }
        if (39 in this.keysDown) {
            this.world.right(modifier);
        }
    };
    return InputHandler;
})();
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero() {
        _super.apply(this, arguments);
        this.sourceWidth = 32;
        this.sourceHeight = 30;
        this.destinationWidth = 32;
        this.destinationHeight = 30;
        this.speed = 256;
        this.sourceY = 513;
        this.direction = 0;
    }
    Hero.prototype.draw = function () {
        this.destinationX = this.world.heroViewOffsetX();
        this.destinationY = this.world.heroViewOffsetY();
        _super.prototype.draw.call(this);
    };
    Hero.prototype.viewOffsetX = function (width) {
        return (width / 2) - (this.destinationWidth / 2);
    };
    Hero.prototype.viewOffsetY = function (height) {
        return (height / 2) - (this.destinationHeight / 2);
    };
    Hero.prototype.reset = function (width, height) {
        this.x = this.viewOffsetX(width);
        this.y = this.viewOffsetY(height);
    };
    Hero.prototype.velocity = function (mod) {
        return this.speed * mod;
    };
    Hero.prototype.collision = function (x, y) {
        var _this = this;
        this.world.collidableSprites().forEach(function (sprite) {
            if (y > sprite.y - _this.destinationHeight && y < sprite.y + sprite.destinationHeight && x > sprite.x - _this.destinationWidth && x < sprite.x + sprite.destinationWidth) {
                return true;
            }
        });
        return false;
    };
    Hero.prototype.up = function (mod) {
        this.direction = 64;
        var y = this.y - this.velocity(mod);
        if (y > 0 && !this.collision(this.x, y)) {
            this.y -= this.velocity(mod);
        }
    };
    Hero.prototype.down = function (mod, height) {
        this.direction = 0;
        var y = this.y + this.velocity(mod);
        if (y < height - this.destinationHeight && !this.collision(this.x, y)) {
            this.y += this.velocity(mod);
        }
    };
    Hero.prototype.left = function (mod) {
        this.direction = 128;
        var x = this.x - this.velocity(mod);
        if (x > 0 && !this.collision(x, this.y)) {
            this.x -= this.velocity(mod);
        }
    };
    Hero.prototype.right = function (mod, width) {
        this.direction = 192;
        var x = this.x + this.velocity(mod);
        if (x < width - this.destinationWidth && !this.collision(x, this.y)) {
            this.x += this.velocity(mod);
        }
    };
    return Hero;
})(Entity);
var World = (function () {
    function World() {
        this.width = 512;
        this.height = 480;
        this.viewWidth = 400;
        this.viewHeight = 300;
        this.sprites = [];
        this.ctx = this.createCanvas();
        this.hero = new Hero(this);
        this.sprites.push(new Background(this));
        this.sprites.push(this.hero);
    }
    World.prototype.createCanvas = function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.viewWidth;
        canvas.height = this.viewHeight;
        $("#game").append(canvas);
        return canvas.getContext("2d");
    };
    //Hero coordinates in view
    World.prototype.heroViewOffsetX = function () {
        return this.hero.viewOffsetX(this.viewWidth);
    };
    World.prototype.heroViewOffsetY = function () {
        return this.hero.viewOffsetY(this.viewHeight);
    };
    //Max scroll coordinates
    World.prototype.viewWidthLimit = function () {
        return this.width - this.viewWidth;
    };
    World.prototype.viewHeightLimit = function () {
        return this.height - this.viewHeight;
    };
    //Check hero limits
    World.prototype.atViewLimitLeft = function () {
        return this.hero.x < this.heroViewOffsetX();
    };
    World.prototype.atViewLimitTop = function () {
        return this.hero.y < this.heroViewOffsetY();
    };
    World.prototype.atViewLimitRight = function () {
        return this.hero.x > this.viewWidthLimit() + this.heroViewOffsetX();
    };
    World.prototype.atViewLimitBottom = function () {
        return this.hero.y > this.viewHeightLimit() + this.heroViewOffsetY();
    };
    World.prototype.render = function (lastUpdate, lastElapsed) {
        this.sprites.forEach(function (sprite) {
            sprite.draw();
        });
    };
    World.prototype.reset = function () {
        this.hero.reset(this.width, this.height);
    };
    World.prototype.up = function (mod) {
        this.hero.up(mod);
    };
    World.prototype.down = function (mod) {
        this.hero.down(mod, this.height);
    };
    World.prototype.left = function (mod) {
        this.hero.left(mod);
    };
    World.prototype.right = function (mod) {
        this.hero.right(mod, this.width);
    };
    World.prototype.collidableSprites = function () {
        var result = [];
        this.sprites.forEach(function (sprite) {
            if (sprite.collidable) {
                result.push(sprite);
            }
        });
        return result;
    };
    return World;
})();
var Game = (function () {
    function Game() {
    }
    Game.prototype.run = function () {
        this.setup();
        this.reset();
        this.then = Date.now();
        this.animate();
    };
    Game.prototype.animate = function () {
        var _this = this;
        requestAnimFrame(function () {
            _this.animate();
            _this.main();
        });
    };
    Game.prototype.setup = function () {
        this.world = new World;
        this.inputHandler = new InputHandler(this.world);
    };
    Game.prototype.reset = function () {
        this.world.reset();
    };
    Game.prototype.main = function () {
        var now = Date.now();
        var delta = now - this.lastUpdate;
        this.lastUpdate = now;
        this.lastElapsed = delta;
        this.update(delta / 1000);
        this.render();
    };
    Game.prototype.update = function (modifier) {
        this.inputHandler.update(modifier);
    };
    Game.prototype.render = function () {
        this.world.render(this.lastUpdate, this.lastElapsed);
    };
    return Game;
})();
