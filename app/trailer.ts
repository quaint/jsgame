import Vehicle from './vehicle'
import Point from './basic/point'
import Circle from './basic/circle'
import Size from './basic/size'
import configuration from './configuration'

export default class Trailer extends Vehicle {

    grain = 0
    maxGrain: number

    constructor(origin: Point, size: Size, maxGrain: number, sprite: HTMLImageElement, ctx: CanvasRenderingContext2D) {
        super(origin, size, sprite, ctx)
        this.maxGrain = maxGrain;
        this.radius = this.size.width * 0.3;
        this.anchorY = 0.5
        this.anchorX = 0.0
        this.maxAngle = 55 
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.origin.x, this.origin.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        // if (this.grain > 0) {
        //     this.ctx.drawImage(this.sprite, 20, 20, 20, 20, -this.width, -this.height / 2, this.width, this.height);
        // } else {
            this.ctx.drawImage(this.sprite, 0, 180, this.size.width, this.size.height,
                this.anchorX * -this.size.width, this.anchorY * -this.size.height, 
                this.size.width, this.size.height);
        // }
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().center.x, this.getBoundingSphere().center.y, 
                this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        // this.ctx.fillStyle = "rgb(0,0,0)";
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 6, 6);
        // this.ctx.fillRect(this.getBoundingSphere().x, this.getBoundingSphere().y, 10, 10);
        // this.ctx.fillStyle = "rgb(200,0,0)";
        // this.ctx.fillRect(this.x, this.y, 4, 4);
    };

    getPin(): Point {
        return {
            x: this.origin.x + Math.cos(this.angle) * this.size.width,
            y: this.origin.y + Math.sin(this.angle) * this.size.width
        };
    }

    getBoundingSphere(): Circle {
        return {
            center: {
                x: this.origin.x + Math.cos(this.angle) * this.radius,
                y: this.origin.y + Math.sin(this.angle) * this.radius,
            },
            radius: this.radius
        };
    }
}
