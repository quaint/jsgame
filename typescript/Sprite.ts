/// <reference path="SpriteImage.ts" />
/// <reference path="World.ts" />

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
    angle: number = 0;
    image: SpriteImage = new SpriteImage;
    collidable: boolean = false;

    constructor(public world: World) {

    }

    drawImage(sx: number, sy: number, dx: number, dy: number) {
        if (this.image.ready) {
            this.world.ctx.save();
            this.world.ctx.translate(dx, dy);
            this.world.ctx.rotate(this.angle * Math.PI / 180);
            this.world.ctx.drawImage(this.image.image, sx, sy, this.sourceWidth, this.sourceHeight, -this.destinationWidth + 30, -this.destinationHeight / 2, this.destinationWidth, this.destinationHeight);
            this.world.ctx.restore();
        }
    }
}