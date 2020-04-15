import configuration from "./configuration";
import Vehicle from "./vehicle";
import Point from "./point";
import Sphere from "./sphere";

export default class Trailer extends Vehicle {
    constructor(position, size, maxGrain, sprite, ctx) {
        super(position, size, sprite, ctx);
        this.grain = 0;
        this.maxGrain = maxGrain;
        this.radius = this.size.width * 0.3;
        this.anchor = new Point(0.0, 0.5);
        this.maxAngle = configuration.maxAngle;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        // if (this.grain > 0) {
        //     this.ctx.drawImage(this.sprite, 20, 20, 20, 20, -this.size.width, -this.size.height / 2, this.size.width, this.size.height);
        // } else {
        this.ctx.drawImage(this.sprite, 0, 180, this.size.width, this.size.height,
            this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width, this.size.height);
        // }
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().position.x, this.getBoundingSphere().position.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        // this.ctx.fillStyle = "rgb(0,0,0)";
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 6, 6);
        // this.ctx.fillRect(this.getBoundingSphere().x, this.getBoundingSphere().y, 10, 10);
        // this.ctx.fillStyle = "rgb(200,0,0)";
        // this.ctx.fillRect(this.position.x, this.position.y, 4, 4);
    }

    getPin() {
        return new Point(
            this.position.x + Math.cos(this.angle) * this.size.width,
            this.position.y + Math.sin(this.angle) * this.size.width);
    }

    getBoundingSphere() {
        let position = new Point(this.position.x + Math.cos(this.angle) * this.radius, this.position.y + Math.sin(this.angle) * this.radius);
        return new Sphere(position, this.radius);
    }
}
