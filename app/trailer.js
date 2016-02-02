define(['./vehicle'], function (createVehicle) {
  return function (x, y, width, height, maxGrain) {
    var trailer = createVehicle(x, y, width, height);
    trailer.grain = 0;
    trailer.maxGrain = maxGrain;
    return trailer;
  };
});