define(['./vehicle'], function(createVehicle) {
    return function(x, y, width, height, maxGrain, maxFuel, sprite, ctx) {
        var combine = createVehicle(x, y, width, height, sprite, ctx);
        combine.linearSpeed = 50;
        combine.pouringSpeed = 100;
        combine.grain = 0;
        combine.maxGrain = maxGrain;
        combine.fuel = maxFuel;
        combine.maxFuel = maxFuel;
        combine.workingTime = 0;
        combine.defaultWorkingTime = 1000;
        combine.workingSpeed = 1000;

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

        combine.radiusHeader = combine.height / 2;
        combine.angleHeader = 60;
        var backHeight = combine.height / 10;
        var centerToBack = combine.width - 30;
        combine.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        var angleBackRad = Math.atan2(backHeight, centerToBack);
        combine.angleBack = angleBackRad * 180 / Math.PI;

        combine.pouring = false;

        combine.isProcessing = function() {
            return combine.workingTime > 0;
        };

        combine.update = function(timeDiff, dx, dy, command) {
            var timeDelta = timeDiff * 0.001;
            var linearDistEachFrame = combine.linearSpeed * timeDelta;

            combine.pouring = command;

            if (dy !== 0 || combine.pouring) {
                if (combine.fuel > 0) {
                    combine.fuel -= timeDelta;
                } else {
                    combine.fuel = 0;
                }
            }

            if (combine.fuel > 0) {
                if (dy == 1) {
                    combine.angle += linearDistEachFrame * -dx;
                } else if (dy == -1) {
                    combine.angle += linearDistEachFrame * dx;
                }

                combine.x -= dy * Math.cos(combine.angle * Math.PI / 180) * linearDistEachFrame;
                combine.y -= dy * Math.sin(combine.angle * Math.PI / 180) * linearDistEachFrame;
            }

            if (combine.workingTime > 0) {
                combine.workingTime -= timeDelta * combine.workingSpeed;
            }

            updateHeader();
            updateBack();
            combine.updateAnimation(timeDiff);
        };

        combine.notifyShouldProcess = function() {
            if (combine.grain < combine.maxGrain) {
                combine.grain += 1;
            }
            combine.workingTime = combine.defaultWorkingTime;
        };

        combine.updateTrailer = function(timeDiff, trailer) {
            var timeDelta = timeDiff * 0.001;
            if (combine.pouring) {
                var distance = combine.distanceTo(trailer);
                if (combine.grain > 0 && distance < combine.width) {
                    combine.grain -= timeDelta * combine.pouringSpeed;
                    if (trailer.grain < trailer.maxGrain) {
                        trailer.grain += timeDelta * combine.pouringSpeed;
                    }
                }
            }
        };

        combine.draw = function() {
            combine.ctx.save();
            // combine.ctx.fillRect(combine.x, combine.y, 20, 20);
            combine.ctx.translate(combine.x, combine.y);
            combine.ctx.rotate(combine.angle * Math.PI / 180);
            if (combine.isProcessing()) {
                ctx.drawImage(combine.sprite, combine.animationFrame * 20, 80, 20, 20, -combine.width + 20, -combine.height / 2 + 31, 20, 20);
            }
            combine.ctx.drawImage(combine.sprite, 0, 100, combine.width, combine.height, -combine.width + 30, -combine.height / 2, combine.width, combine.height);
            combine.ctx.restore();
        };

        function updateHeader() {
            var diagonalAngle1 = combine.angle + combine.angleHeader;
            var diagonalAngle2 = combine.angle - combine.angleHeader;
            var diagonalAngleRad1 = diagonalAngle1 * Math.PI / 180;
            var diagonalAngleRad2 = diagonalAngle2 * Math.PI / 180;
            combine.header.x1 = Math.cos(diagonalAngleRad1) * combine.radiusHeader + combine.x;
            combine.header.y1 = Math.sin(diagonalAngleRad1) * combine.radiusHeader + combine.y;
            combine.header.x2 = Math.cos(diagonalAngleRad2) * combine.radiusHeader + combine.x;
            combine.header.y2 = Math.sin(diagonalAngleRad2) * combine.radiusHeader + combine.y;
        }

        function updateBack() {
            var diagonalAngleBack1 = combine.angle + combine.angleBack - 180; //flip to back of combine
            var diagonalAngleBack2 = combine.angle - combine.angleBack - 180; //flip to back of combine
            var diagonalAngleBackRad1 = diagonalAngleBack1 * Math.PI / 180;
            var diagonalAngleBackRad2 = diagonalAngleBack2 * Math.PI / 180;
            combine.back.x1 = Math.cos(diagonalAngleBackRad1) * combine.radiusBack + combine.x;
            combine.back.y1 = Math.sin(diagonalAngleBackRad1) * combine.radiusBack + combine.y;
            combine.back.x2 = Math.cos(diagonalAngleBackRad2) * combine.radiusBack + combine.x;
            combine.back.y2 = Math.sin(diagonalAngleBackRad2) * combine.radiusBack + combine.y;
        }

        return combine;
    };
});
