import configuration from "../configuration";
import Vehicle from "./vehicle";
import Point from "../geometry/point";
import Sphere from "../geometry/sphere";

export default class Trailer extends Vehicle {
    constructor(position, size, anchor, maxGrain, sprite, ctx) {
        super(position, size, anchor, sprite, ctx);
        this.grain = 0;
        this.maxGrain = maxGrain;
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
            this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        // }
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().position.x, this.getBoundingSphere().position.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.fillRect(this.getPin().x, this.getPin().y, 2, 2);
            this.ctx.stroke();
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
        // this.ctx.fillStyle = "rgb(0,0,0)";
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 6, 6);
        // this.ctx.fillRect(this.getBoundingSphere().x, this.getBoundingSphere().y, 10, 10);
        // this.ctx.fillStyle = "rgb(200,0,0)";
        // this.ctx.fillRect(this.position.x, this.position.y, 4, 4);
    }
}
