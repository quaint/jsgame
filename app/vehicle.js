define(function () {
    return function (x, y, width, height, sprite, ctx) {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            angle: 0,
            sprite: sprite,
            ctx: ctx,
            linearSpeed: 10,
            animationFrame: 0,
            animationDelta: 0,
            msPerFrame: 100,
            updateAnimation: function (timeDiff) {
                if (this.animationDelta > this.msPerFrame) {
                    this.animationDelta = 0;
                    this.animationFrame++;
                    if (this.animationFrame > 1) {
                        this.animationFrame = 0;
                    }
                } else {
                    this.animationDelta += timeDiff;
                }
            },
            distanceTo: function (otherObject) {
                return Math.sqrt(Math.pow(this.x - otherObject.x, 2) + Math.pow(this.y - otherObject.y, 2));
            }
        }
    };
});
