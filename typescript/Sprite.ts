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
            this.world.ctx.drawImage(this.image.image, sx, sy, this.sourceWidth, this.sourceHeight, dx, dy, this.destinationWidth, this.destinationHeight);
        }
    }
}