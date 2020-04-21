import configuration from "../configuration";
import Vehicle from "./vehicle";
import Point from "../geometry/point";
import Sphere from "../geometry/sphere";
import Size from "../geometry/size";

export default class Trailer extends Vehicle {

    grain: number;
    maxGrain: number;
    maxAngle: number;

    constructor(position: Point, size: Size, maxGrain: number, sprite, ctx) {
        super(position, size, sprite, ctx);
        this.grain = 0;
        this.maxGrain = maxGrain;
        this.maxAngle = configuration.maxAngle;
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        if (this.grain > 0) {
            this.ctx.drawImage(this.sprite, 0, 270, this.size.width, this.size.height,
                this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        } else {
            this.ctx.drawImage(this.sprite, 0, 180, this.size.width, this.size.height,
                this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        }
        this.ctx.restore();
        super.draw();
    }
}
