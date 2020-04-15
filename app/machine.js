import Vehicle from "./vehicle";
import * as utils from "./utils";
import Point from "./point";

export default class Machine extends Vehicle {

    constructor(position, size, sprite, ctx) {
        super(position, size, sprite, ctx);
        this.radius = this.size.width * 0.3;
        this.anchor = new Point(0.0, 0.5);
        this.maxAngle = 0;
        this.workSpeed = 30;
        this.back = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        let backHeight = this.size.height - 20;
        let centerToBack = this.size.width - 15;
        this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        this.angleBack = Math.atan2(backHeight, centerToBack);
    }

    updateBack() {
        let diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of machine
        let diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of machine
        this.back.x1 = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.y1 = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.x2 = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.y2 = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        this.ctx.drawImage(this.sprite, 0, 230, this.size.width, this.size.height,
            this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width, this.size.height);
        this.ctx.restore();
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.back.x1, this.back.y1);
        // this.ctx.lineTo(this.back.x2, this.back.y2);
        // this.ctx.stroke();
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 4, 4);
        // this.ctx.fillRect(this.position.x, this.position.y, 5, 5);
    };

    getPin() {
        return new Point(
            this.position.x + Math.cos(this.angle) * this.size.width,
            this.position.y + Math.sin(this.angle) * this.size.width
        );
    };
}
