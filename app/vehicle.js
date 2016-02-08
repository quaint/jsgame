define(function() {
    return function(x, y, width, height, sprite, ctx) {

        var vehicle = {
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
            msPerFrame: 100
        };

        vehicle.updateAnimation = function(timeDiff) {
            if (vehicle.animationDelta > vehicle.msPerFrame) {
                vehicle.animationDelta = 0;
                vehicle.animationFrame++;
                if (vehicle.animationFrame > 1) {
                    vehicle.animationFrame = 0;
                }
            } else {
                vehicle.animationDelta += timeDiff;
            }
        };

        vehicle.distanceTo = function(otherObject) {
            return Math.sqrt(Math.pow(vehicle.x - otherObject.x, 2) + Math.pow(vehicle.y - otherObject.y, 2));
        };

        return vehicle;
    };
});
