import Size from './basic/size'
import Point from './basic/point'
import Circle from './basic/circle'
import Machine from './machine'
import Collidable from './basic/collidable'

export default abstract class Vehicle implements Collidable {

    origin: Point
    size: Size
    angle = 0
    maxAngle = 0
    sprite: HTMLImageElement
    ctx: CanvasRenderingContext2D
    linearSpeed = 10
    animationFrame = 0
    animationDelta = 0
    msPerFrame = 100
    connectedObject: Machine
    radius: number
    anchorX = 0.5
    anchorY = 0.5

    constructor(origin: Point, size: Size, sprite: HTMLImageElement, ctx: CanvasRenderingContext2D) {
        this.origin = origin;
        this.size = size;
        this.sprite = sprite;
        this.ctx = ctx;
        this.radius = size.width * 0.5;
    }

    abstract getPin(): Point

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

    distanceTo(otherObject: Vehicle): number {
        let dx = this.origin.x - otherObject.origin.x;
        let dy = this.origin.y - otherObject.origin.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
