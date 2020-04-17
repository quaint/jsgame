import Vehicle from "./vehicle";
import * as utils from "../utils";
import Point from "../geometry/point";
import Line from "../geometry/line";
import configuration from "../configuration";
import Sphere from "../geometry/sphere";

export default class Machine extends Vehicle {

    constructor(position, size, anchor, sprite, ctx) {
        super(position, size, anchor, sprite, ctx);
        this.radius = this.size.height / 2;
        this.maxAngle = 0;
        this.workSpeed = 30;
        this.back = new Line(new Point(0, 0), new Point(0, 0));
        let backHeight = 20;
        let centerToBack = -5;
        this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        this.angleBack = Math.atan2(backHeight, centerToBack);
    }

    updateBack() {
        let diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of machine
        let diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of machine
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        this.ctx.drawImage(this.sprite, 0, 230, this.size.width, this.size.height,
            this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            this.ctx.moveTo(this.back.start.x, this.back.start.y);
            this.ctx.lineTo(this.back.end.x, this.back.end.y);
            this.ctx.stroke();
            this.ctx.fillRect(this.getPin().x, this.getPin().y, 2, 2);
            // this.ctx.fillRect(this.position.x, this.position.y, 5, 5);
            this.ctx.beginPath();
            let boundingSphere = this.getBoundingSphere();
            this.ctx.arc(boundingSphere.position.x, boundingSphere.position.y, boundingSphere.radius, 0, 2 * Math.PI, false);
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
}
