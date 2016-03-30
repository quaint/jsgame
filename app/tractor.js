define(['./vehicle', './utils'], function (createVehicle, utils) {
    return function (x, y, width, height, maxFuel, sprite, ctx) {
        var tractor = createVehicle(x, y, width, height, sprite, ctx);
        tractor.linearSpeed = 70;
        tractor.fuel = maxFuel;
        tractor.maxFuel = maxFuel;

        tractor.update = function (timeDiff, dx, dy, command) {
            var timeDelta = timeDiff * 0.001;
            var linearDistEachFrame = tractor.linearSpeed * timeDelta;

            if (dy !== 0) {
                if (tractor.fuel > 0) {
                    tractor.fuel -= timeDelta;
                } else {
                    tractor.fuel = 0;
                }
            }

            if (tractor.fuel > 0) {
                if (dy == 1) {
                    tractor.angle += (linearDistEachFrame * -dx) * Math.PI / 180;
                } else if (dy == -1) {
                    tractor.angle += (linearDistEachFrame * dx) * Math.PI / 180;
                }
                
                tractor.angle = utils.normalizeAngle(tractor.angle);

                tractor.x -= dy * Math.cos(tractor.angle) * linearDistEachFrame;
                tractor.y -= dy * Math.sin(tractor.angle) * linearDistEachFrame;
            }
        };

        tractor.draw = function () {
            tractor.ctx.save();
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 10, 10);
            tractor.ctx.translate(tractor.x, tractor.y);
            tractor.ctx.rotate(tractor.angle);
            tractor.ctx.drawImage(tractor.sprite, 0, 205, tractor.width, tractor.height, -2, -tractor.height / 2, tractor.width, tractor.height);
            tractor.ctx.restore();
        };

        return tractor;
    };
});
