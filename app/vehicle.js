define(function () {
    return function (x, y, width, height) {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            angle: 0,
            sprite: null,
            linearSpeed: 10
        };
    };
});