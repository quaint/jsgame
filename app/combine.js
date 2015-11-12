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
        combine.diagonal = 0;
        combine.diagonalAngleRad = 0;
        combine.diagonalAngleDeg = 0;
        combine.diagonal2 = 0;
        combine.diagonal2AngleRad = 0;
        combine.diagonal2AngleDeg = 0;
        combine.pouring = false;
        return combine;
    }
});