/// <reference path="Background.ts" />
/// <reference path="Hero.ts" />
/// <reference path="Combine.ts" />

declare var $;

class World {
    width: number = 512;
    height: number = 480;
    viewWidth: number = 400;
    viewHeight: number = 300;
    ctx: any;
    sprites: Entity[] = [];
    vehicle: Vehicle;

    constructor() {
        this.ctx = this.createCanvas();
        this.vehicle = new Combine(this);
        this.sprites.push(new Background(this));
        this.sprites.push(this.vehicle);
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
        return this.vehicle.viewOffsetX(this.viewWidth);
    }

    heroViewOffsetY(): number {
        return this.vehicle.viewOffsetY(this.viewHeight);
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
        return this.vehicle.x < this.heroViewOffsetX();
    }

    atViewLimitTop(): boolean {
        return this.vehicle.y < this.heroViewOffsetY();
    }

    atViewLimitRight(): boolean {
        return this.vehicle.x > this.viewWidthLimit() + this.heroViewOffsetX();
    }

    atViewLimitBottom(): boolean {
        return this.vehicle.y > this.viewHeightLimit() + this.heroViewOffsetY();
    }

    render(lastUpdate: number, lastElapsed: number) {
        this.sprites.forEach(sprite => {
            sprite.draw();
        });
    }

    reset() {
        this.vehicle.reset(this.width, this.height);
    }
    
    up(mod: number) {
        this.vehicle.up(mod);
    }
    
    down(mod: number) {
        this.vehicle.down(mod, this.height);
    }
    
    left(mod: number) {
        this.vehicle.left(mod);
    }
    
    right(mod: number) {
        this.vehicle.right(mod, this.width);
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