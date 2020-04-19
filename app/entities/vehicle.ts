import Point from "../geometry/point";
import Sphere from "../geometry/sphere";
import * as utils from "../utils";
import Size from "../geometry/size";
import configuration from "../configuration";
import {toRadians} from "../utils";
import {normalizeAngle} from "../utils";

export default abstract class Vehicle {

    position: Point;
    newPosition: Point;
    angle: number;
    newAngle: number;
    size: Size;

    sprite: any;
    ctx: CanvasRenderingContext2D;
    linearSpeed: number;
    animationFrame: number;
    animationDelta: number;
    readonly msPerFrame: number;
    readonly boundingSphereRadius: number;

    connectedObject: Vehicle;
    readonly anchor: Point;
    readonly xDiff: number;
    readonly yDiff: number;
    topLeftOffset: Point;
    maxAngle: number;

    workSpeed: number;
    fuel: number;
    maxFuel: number;
    grain: number;
    maxGrain: number;

    protected constructor(position: Point, size: Size, sprite: any, ctx: CanvasRenderingContext2D) {

        this.position = position;
        this.size = size;
        this.anchor = new Point(0.5, 0.5);
        this.topLeftOffset = new Point(-this.size.width * this.anchor.x, -this.size.height * this.anchor.y)

        this.sprite = sprite;
        this.ctx = ctx;
        this.boundingSphereRadius = utils.max(size.width, size.height) * 0.5;

        this.angle = 0;
        this.linearSpeed = 10;
        this.connectedObject = null;

        this.msPerFrame = 100;
        this.animationFrame = 0;
        this.animationDelta = 0;
    }

    setPositionFromNew() {
        this.position = this.newPosition;
    }

    setAngleFromNew() {
        this.angle = this.newAngle;
    }

    getBoundingSphere(): Sphere {
        return this.getBoundingSphereForPoint(this.position);
    }

    getBoundingSphereForPoint(point: Point): Sphere {
        return new Sphere(new Point(point.x, point.y),
            this.boundingSphereRadius);
    }

    getFrontPin(): Point {
        return new Point(
            this.position.x + Math.cos(this.angle) * this.size.halfOfWidth,
            this.position.y + Math.sin(this.angle) * this.size.halfOfWidth);
    }

    getBackPin(): Point {
        return new Point(
            this.position.x - Math.cos(this.angle) * this.size.halfOfWidth,
            this.position.y - Math.sin(this.angle) * this.size.halfOfWidth);
    }

    dragFromPointAndAngle(point: Point, pointAngle: number): void {

        let objectsDx = point.x - this.position.x;
        let objectsDy = point.y - this.position.y;
        let angle = Math.atan2(objectsDy, objectsDx);

        let maxAngle = toRadians(this.maxAngle);
        let angleDelta = this.angle - pointAngle;
        angleDelta = normalizeAngle(angleDelta);

        if (angleDelta <= maxAngle && angleDelta >= -maxAngle) {
            this.angle = angle;
        } else if (angleDelta > maxAngle) {
            this.angle = angle - angleDelta + maxAngle;
        } else if (angleDelta < -maxAngle) {
            this.angle = angle - angleDelta - maxAngle;
        }

        let pinAndDragPointDx = this.getFrontPin().x - this.position.x;
        let pinAndDragPointDy = this.getFrontPin().y - this.position.y;

        let newX = point.x - pinAndDragPointDx;
        let newY = point.y - pinAndDragPointDy;

        this.position = new Point(newX, newY);
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

    isInCollision(otherObjects: Array<Vehicle>): boolean {
        let collision = false;
        for (let i = 0; i < otherObjects.length; i++) {
            let otherBoundingSphere = otherObjects[i].getBoundingSphere();
            let sphere = this.getBoundingSphereForPoint(this.newPosition);
            if (utils.checkCollision(otherBoundingSphere, sphere)) {
                collision = true;
                break;
            }
        }
        return collision;
    }

    draw(): void {
        if (configuration.debug) {
            this.ctx.save();

            //bounding sphere
            let boundingSphere = this.getBoundingSphere();
            this.ctx.strokeStyle = "#3300aa";
            this.ctx.beginPath();
            this.ctx.arc(boundingSphere.position.x, boundingSphere.position.y,
                boundingSphere.radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();

            // this.ctx.fillStyle = "#3300aa";
            // this.ctx.fillRect(boundingSphere.position.x, boundingSphere.position.y, 3, 3);

            //pin
            // this.ctx.fillStyle = "#5bffa6";
            // this.ctx.fillRect(this.getFrontPin().x, this.getFrontPin().y, 3, 3);

            // this.ctx.fillStyle = "#445cff";
            // this.ctx.fillRect(this.getBackPin().x, this.getBackPin().y, 3, 3);

            // this.ctx.fillStyle = "#ff84bc";
            // this.ctx.fillRect(this.position.x, this.position.y, 3, 3);

            // this.ctx.translate(this.position.x, this.position.y);
            // this.ctx.rotate(this.angle);

            //center
            // this.ctx.strokeStyle = "#ffff00";
            // this.ctx.beginPath();
            // this.ctx.arc(this.xDiff, this.yDiff, boundingSphere.radius, 0,
            //     2 * Math.PI, false);
            // this.ctx.stroke();

            // this.ctx.fillStyle = "#ffce4e";
            // this.ctx.fillRect(this.topLeftOffset.x, this.topLeftOffset.y,4, 4);

            //pivot
            // this.ctx.fillStyle = "#ff33aa";
            // this.ctx.fillRect(0, 0, 3, 3);

            //center - yellow
            this.ctx.fillStyle = "#ffff00";
            this.ctx.fillRect(-this.xDiff, -this.yDiff, 3, 3);

            //box - yellow
            // this.ctx.strokeStyle = "#ffff00";
            // this.ctx.strokeRect(this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);

            this.ctx.restore();
        }
    }
}
