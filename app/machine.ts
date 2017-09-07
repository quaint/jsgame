import Size from './basic/size'
import Point from './basic/point'
import Circle from './basic/circle'
import Vehicle from './vehicle'
import Line from './basic/line'
import { utils } from './utils'

export default abstract class Machine extends Vehicle {

    workSpeed: number
    back: Line
    radiusBack: number
    angleBack: number

    constructor(origin: Point, size: Size, sprite: HTMLImageElement, ctx: CanvasRenderingContext2D) {
        super(origin, size, sprite, ctx)
        this.radius = this.size.width * 0.3;
        this.anchorY = 0.5;
        this.anchorX = 0.0;
        this.maxAngle = 0;
        this.workSpeed = 30;
        this.back = {
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        };

        let backHeight = this.size.height - 20;
        let centerToBack = this.size.width - 15;
        this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        this.angleBack = Math.atan2(backHeight, centerToBack);
    }

    updateBack() {
        let diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of this
        let diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of this
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.origin.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.origin.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.origin.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.origin.y;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.origin.x, this.origin.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        this.ctx.drawImage(this.sprite, 0, 230, this.size.width, this.size.height,
            this.anchorX * -this.size.width, this.anchorY * -this.size.height, this.size.width, this.size.height);
        this.ctx.restore();
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.back.x1, this.back.y1);
        // this.ctx.lineTo(this.back.x2, this.back.y2);
        // this.ctx.stroke();
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 4, 4);
        // this.ctx.fillRect(this.x, this.y, 5, 5);
    }

    getPin() {
        return {
            x: this.origin.x + Math.cos(this.angle) * this.size.width,
            y: this.origin.y + Math.sin(this.angle) * this.size.width
        };
    }
}
