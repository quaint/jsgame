define(['./vehicle', './utils', './configuration'], function (createVehicle, utils, configuration) {
    return function (x, y, width, height, maxFuel, sprite, ctx) {
        var tractor = createVehicle(x, y, width, height, sprite, ctx);
        tractor.linearSpeed = configuration.tractorLinearSpeed;
        tractor.fuel = maxFuel;
        tractor.maxFuel = maxFuel;

        tractor.update = function (timeDiff, moveDirection, rotateDirection, command, isActive) {
            if (isActive) {
                var timeDelta = timeDiff * 0.001;
                var linearDistEachFrame = tractor.linearSpeed * timeDelta;

                if (rotateDirection !== 0) {
                    if (tractor.fuel > 0) {
                        tractor.fuel -= timeDelta;
                    } else {
                        tractor.fuel = 0;
                    }
                }

                if (tractor.fuel > 0) {
                    if (rotateDirection == 1) {
                        tractor.angle += utils.toRadians(linearDistEachFrame * -moveDirection);
                    } else if (rotateDirection == -1) {
                        tractor.angle += utils.toRadians(linearDistEachFrame * moveDirection);
                    }

                    tractor.angle = utils.normalizeAngle(tractor.angle);

                    tractor.x -= rotateDirection * Math.cos(tractor.angle) * linearDistEachFrame;
                    tractor.y -= rotateDirection * Math.sin(tractor.angle) * linearDistEachFrame;
                }
            }
        };

        tractor.draw = function () {
            tractor.ctx.save();
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 10, 10);
            tractor.ctx.translate(tractor.x, tractor.y);
            tractor.ctx.rotate(tractor.angle);
            tractor.ctx.drawImage(tractor.sprite, 0, 205, tractor.width, tractor.height, -2, -tractor.height / 2, tractor.width, tractor.height);
            tractor.ctx.beginPath();
            tractor.ctx.arc(0, 0, tractor.radius, 0, 2 * Math.PI, false);
            tractor.ctx.stroke();
            tractor.ctx.restore();
        };

        return tractor;
    };
});
