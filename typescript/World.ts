/// <reference path="Background.ts" />
/// <reference path="Hero.ts" />

declare var $;

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