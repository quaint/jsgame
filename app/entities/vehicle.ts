import Point from "../geometry/point";
import Sphere from "../geometry/sphere";
import * as utils from "../utils";
import Size from "../geometry/size";

export default class Vehicle {

    position: Point;
    size: Size;
    angle: number;
    sprite: any;
    ctx: CanvasRenderingContext2D;
    linearSpeed: number;
    animationFrame: number;
    animationDelta: number;
    readonly msPerFrame: number;
        connectedObject: Vehicle;
    readonly boundingSphereRadius: number;
    anchor: Point;
    readonly xDiff: number;
    pivot: Point;
    maxAngle: number;
    workSpeed: number;
    fuel: number;
    maxFuel: number;
    grain: number;
    maxGrain: number;

    constructor(position: Point, size: Size, anchor: Point, sprite: any, ctx: CanvasRenderingContext2D) {
        this.position = position;
        this.size = size;
        this.angle = 0;
        this.sprite = sprite;
        this.ctx = ctx;
        this.linearSpeed = 10;
        this.animationFrame = 0;
        this.animationDelta = 0;
        this.msPerFrame = 100;
        this.connectedObject = null;
        this.boundingSphereRadius = utils.max(size.width, size.height) * 0.5;
        this.anchor = anchor;
        this.xDiff = -this.size.width * (this.anchor.x - 0.5);
        this.pivot = new Point(-this.size.width * this.anchor.x, -this.size.height * this.anchor.y)
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

    distanceTo(otherObjectPosition: Point): number {
        let dx = this.position.x - otherObjectPosition.x;
        let dy = this.position.y - otherObjectPosition.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updateTrailer(timeDiff, trailer) {

    }
}
