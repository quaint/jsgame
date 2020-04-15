class Vehicle {

    constructor(x, y, width, height, sprite, ctx) {
        this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.angle = 0;
            this.sprite = sprite;
            this.ctx = ctx;
            this.linearSpeed = 10;
            this.animationFrame = 0;
            this.animationDelta = 0;
            this.msPerFrame = 100;
            this.connectedObject = null;
            this.radius = width * 0.5;
            this.anchorX = 0.5;
            this.anchorY = 0.5;
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

    distanceTo(otherObject) {
        let dx = this.x - otherObject.x;
        let dy = this.y - otherObject.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

}