import Point from "../geometry/point";
import Sphere from "../geometry/sphere";
import * as utils from "../utils";
import Size from "../geometry/size";

export default abstract class Vehicle {

    position: Point;
    size: Size;
    angle: number;
    sprite: any;
    ctx: CanvasRenderingContext2D;
    linearSpeed: number;
    animationFrame: number;
    animationDelta: number;
    readonly msPerFrame: number;
    readonly boundingSphereRadius: number;

    connectedObject: Vehicle;
    anchor: Point;
    readonly xDiff: number;
    pivot: Point;
    maxAngle: number;

    workSpeed: number;
    fuel: number;
    maxFuel: number;
    grain: number;
    maxGrain: number;

    protected constructor(position: Point, size: Size, anchor: Point, sprite: any, ctx: CanvasRenderingContext2D) {
        this.position = position;
        this.size = size;
        this.sprite = sprite;
        this.ctx = ctx;
        this.anchor = anchor;
        this.boundingSphereRadius = utils.max(size.width, size.height) * 0.5;

        this.angle = 0;
        this.linearSpeed = 10;
        this.connectedObject = null;
        this.xDiff = -this.size.width * (this.anchor.x - 0.5);
        this.pivot = new Point(-this.size.width * this.anchor.x, -this.size.height * this.anchor.y)

        this.msPerFrame = 100;
        this.animationFrame = 0;
        this.animationDelta = 0;
    }

    getBoundingSphere(): Sphere {
        return new Sphere(new Point(this.position.x + this.xDiff, this.position.y), this.boundingSphereRadius);
    }

    getPin(): Point {
        return new Point(
            this.position.x + Math.cos(this.angle) * this.size.width,
            this.position.y + Math.sin(this.angle) * this.size.width);
    }

    updateAnimation(timeDiff: number): void {
        if (this.animationDelta > this.msPerFrame) {
            this.animationDelta = 0;
            this.animationFrame++;
            if (this.animationFrame > 1) {
                this.animationFrame = 0;
            }
        } else {
            this.animationDelta += timeDiff;
        }
    }

    distanceTo(position: Point): number {
        let dx = this.position.x - position.x;
        let dy = this.position.y - position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
