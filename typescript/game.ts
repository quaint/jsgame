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
}

class World {
    width: number = 512;
    height: number = 480;
    viewWidth: number = 400;
    viewHeight: number = 300;
    ctx: any;
    sprites: Entity[] = [];
    hero: Hero;

    constructor() {
        this.ctx = this.createCanvas();
        this.hero = new Hero(this);
        this.sprites.push(this.hero);
    }

    createCanvas(): any {
        var canvas = document.createElement("canvas");
        canvas.width = this.viewWidth;
        canvas.height = this.viewHeight;
        $(".container .game").append(canvas);
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
}

class Game {

    then: number;
    world: World;
    lastUpdate: number;
    lastElapsed: number;

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

    }

    render() {
        this.world.render(this.lastUpdate, this.lastElapsed);
    }
}