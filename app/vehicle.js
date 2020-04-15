import Point from "./point";

export default class Vehicle {

    constructor(position, size, sprite, ctx) {
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
        this.radius = size.width * 0.5;
        this.anchor = new Point(0.5, 0.5);
    }

    updateAnimation(timeDiff) {
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

    distanceTo(otherObjectPosition) {
        let dx = this.position.x - otherObjectPosition.x;
        let dy = this.position.y - otherObjectPosition.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

}
