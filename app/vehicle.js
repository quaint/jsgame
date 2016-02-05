define(function() {
    return function(x, y, width, height) {

        var vehicle = {
            x: x,
            y: y,
            width: width,
            height: height,
            angle: 0,
            sprite: null,
            linearSpeed: 10
        };

        vehicle.distanceTo = function(otherObject) {
            return Math.sqrt(Math.pow(vehicle.x - otherObject.x, 2) + Math.pow(vehicle.y - otherObject.y, 2));
        };

        return vehicle;
    };
});
