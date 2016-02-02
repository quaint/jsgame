define(['./vehicle'], function (createVehicle) {
    return function (x, y, width, height, maxGrain, maxFuel) {
        var combine = createVehicle(x, y, width, height);
        combine.grain = 0;
        combine.maxGrain = maxGrain;
        combine.fuel = maxFuel;
        combine.maxFuel = maxFuel;
        combine.header = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        combine.back = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        combine.diagonalAngleRad = 0;
        combine.diagonalAngleDeg = 0;
        combine.diagonal = combine.height / 2;
        combine.diagonal2 = Math.sqrt(Math.pow(combine.height / 10, 2) + Math.pow(combine.width - 30, 2));
        combine.diagonal2AngleRad = Math.atan2(combine.height / 10, combine.width - 30);
        combine.diagonal2AngleDeg = combine.diagonal2AngleRad * 180 / Math.PI;

        combine.pouring = false;

        return combine;
    };
});