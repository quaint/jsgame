declare var Zepto;
var $ = Zepto;

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
        return window.setTimeout(callback, 1000 / 60);
    };
})();

$(function() {
    var game = new Game;
    game.run();
});

class SpriteImage {
    ready: boolean = false;
    url: string = "images/sheet.png";
    image: any;

    constructor() {
        var image = new Image();
        image.src = this.url;
        image.onload = () => {
            this.ready = true;
        }
        this.image = image;
    }
}

class Sprite {
    sourceX: number = 0;
    sourceY: number = 0;
    sourceWidth: number = 0;
    sourceHeight: number = 0;
    destinationX: number = 0;
    destinationY: number = 0;
    destinationWidth: number = 0;
    destinationHeight: number = 0;
    x: number = 0;
    y: number = 0;
    image: SpriteImage = new SpriteImage;
    collidable: boolean = false;

    constructor(public world: World) {

    }

    drawImage(sx: number, sy: number, dx: number, dy: number) {
        if (this.image.ready) {
            this.world.ctx.drawImage(this.image.image, sx, sy, this.sourceWidth, this.sourceHeight, dx, dy, this.destinationWidth, this.destinationHeight);
        }
    }
}

class Entity extends Sprite {
    draw() {
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
    }
}

class Background extends Sprite {
    constructor(world: World) {
        super(world);
        this.destinationWidth = world.viewWidth;
        this.destinationHeight = world.viewHeight;
        this.sourceWidth = world.viewWidth;
        this.sourceHeight = world.viewHeight
    }

    draw() {
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
    }
}

class InputHandler {
    keysDown: { [key: number]: boolean } = {};

    constructor(public world: World) {
        $("body").keydown( (e) => {
            this.keysDown[e.keyCode] = true;
        });
        $("body").keyup( (e) => {
            delete this.keysDown[e.keyCode];
        });
    }

    update(modifier) {
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
    }
}

class Hero extends Entity {
    sourceWidth: number = 32;
    sourceHeight: number = 30;
    destinationWidth: number = 32;
    destinationHeight: number = 30;
    speed: number = 256;
    sourceY: number = 513;
    direction: number = 0;

    draw() {
        this.destinationX = this.world.heroViewOffsetX();
        this.destinationY = this.world.heroViewOffsetY();
        super.draw();
    }

    viewOffsetX(width: number): number {
        return (width / 2) - (this.destinationWidth / 2);
    }

    viewOffsetY(height: number): number {
        return (height / 2) - (this.destinationHeight / 2);
    }

    reset(width: number, height: number) {
        this.x = this.viewOffsetX(width);
        this.y = this.viewOffsetY(height);
    }
    
    velocity(mod: number): number {
        return this.speed * mod;
    }
    
    collision(x: number, y: number): boolean {
        this.world.collidableSprites().forEach(sprite => {
            if (y > sprite.y - this.destinationHeight && y < sprite.y + sprite.destinationHeight && x > sprite.x - this.destinationWidth && x < sprite.x + sprite.destinationWidth) {
                return true;
            }
        });
        return false;
    }
    
    up(mod: number) {
        this.direction = 64;
        var y = this.y - this.velocity(mod);
        if (y > 0 && !this.collision(this.x, y)) {
            this.y -= this.velocity(mod);
        }
    }
    
    down(mod: number, height: number) {
        this.direction = 0;
        var y = this.y + this.velocity(mod);
        if (y < height - this.destinationHeight && !this.collision(this.x, y)) {
            this.y += this.velocity(mod);
        }
    }

    left(mod: number) {
        this.direction = 128;
        var x = this.x - this.velocity(mod);
        if (x > 0 && !this.collision(x, this.y)) {
            this.x -= this.velocity(mod); 
        }
    }
    
    right(mod: number, width: number) {
        this.direction = 192;
        var x = this.x + this.velocity(mod);
        if (x < width - this.destinationWidth && !this.collision(x, this.y)) {
            this.x += this.velocity(mod);
        }
    }
}

class World {
    width: number = 512;
    height: number = 480;
    viewWidth: number = 400;
    viewHeight: number = 300;
    ctx: any;
    sprites: Sprite[] = [];
    hero: Hero;

    constructor() {
        this.ctx = this.createCanvas();
        this.hero = new Hero(this);
        this.sprites.push(new Background(this));
        this.sprites.push(this.hero);
    }

    createCanvas() {
        var canvas = document.createElement("canvas");
        canvas.width = this.viewWidth;
        canvas.height = this.viewHeight;
        $("#game").append(canvas);
        return canvas.getContext("2d");
    }
    
    //Hero coordinates in view
    heroViewOffsetX(): number {
        return this.hero.viewOffsetX(this.viewWidth);
    }

    heroViewOffsetY(): number {
        return this.hero.viewOffsetY(this.viewHeight);
    }
    
    //Max scroll coordinates
    viewWidthLimit(): number {
        return this.width - this.viewWidth;
    }

    viewHeightLimit(): number {
        return this.height - this.viewHeight;
    }
    
    //Check hero limits
    atViewLimitLeft(): boolean {
        return this.hero.x < this.heroViewOffsetX();
    }

    atViewLimitTop(): boolean {
        return this.hero.y < this.heroViewOffsetY();
    }

    atViewLimitRight(): boolean {
        return this.hero.x > this.viewWidthLimit() + this.heroViewOffsetX();
    }

    atViewLimitBottom(): boolean {
        return this.hero.y > this.viewHeightLimit() + this.heroViewOffsetY();
    }

    render(lastUpdate: number, lastElapsed: number) {
        this.sprites.forEach(sprite => {
            sprite.draw();
        });
    }

    reset() {
        this.hero.reset(this.width, this.height);
    }
    
    up(mod: number) {
        this.hero.up(mod);
    }
    
    down(mod: number) {
        this.hero.down(mod, this.height);
    }
    
    left(mod: number) {
        this.hero.left(mod);
    }
    
    right(mod: number) {
        this.hero.right(mod, this.width);
    }
    
    collidableSprites(): Sprite[] {
        var result: Sprite[] = [];
        this.sprites.forEach(sprite => {
            if (sprite.collidable) {
                result.push(sprite);
            }
        });
        return result;
    }
}

class Game {

    then: number;
    world: World;
    lastUpdate: number;
    lastElapsed: number;
    inputHandler: InputHandler;

    run() {
        this.setup();
        this.reset();
        this.then = Date.now();
        this.animate();
    }

    animate() {
        requestAnimFrame(() => {
            this.animate();
            this.main();
        });
    }

    setup() {
        this.world = new World;
        this.inputHandler = new InputHandler(this.world);
    }

    reset() {
        this.world.reset();
    }

    main() {
        var now = Date.now();
        var delta = now - this.lastUpdate;
        this.lastUpdate = now;
        this.lastElapsed = delta;
        this.update(delta / 1000);
        this.render();
    }

    update(modifier: number) {
        this.inputHandler.update(modifier);
    }

    render() {
        this.world.render(this.lastUpdate, this.lastElapsed);
    }
}