define(["./vehicle", "./utils", "./configuration"], function (createVehicle, utils, configuration) {
    'use strict';
    return function (x, y, width, height, maxGrain, maxFuel, sprite, ctx) {
        var combine = createVehicle(x, y, width, height, sprite, ctx);
        combine.linearSpeed = 20;
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
        combine.angleHeader = 60 * Math.PI / 180;
        var backHeight = combine.height / 10;
        var centerToBack = combine.width - 30;
        combine.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        combine.angleBack = Math.atan2(backHeight, centerToBack);

        combine.pouring = false;

        combine.isProcessing = function () {
            return combine.workingTime > 0;
        };

        combine.update = function (timeDiff, rotateDirection, moveDirection, command, isActive, otherObjects) {
            var timeDelta = timeDiff * 0.001;

            if (isActive) {

                var linearDistEachFrame = combine.linearSpeed * timeDelta;
                combine.pouring = command;

                if (moveDirection !== 0 || combine.pouring) {
                    if (combine.fuel > 0) {
                        combine.fuel -= timeDelta;
                    } else {
                        combine.fuel = 0;
                    }
                }

                if (combine.fuel > 0) {
                    var newAngle = combine.angle;
                    if (moveDirection === 1) {
                        newAngle += (linearDistEachFrame * -rotateDirection) * Math.PI / 180;
                    } else if (moveDirection === -1) {
                        newAngle += (linearDistEachFrame * rotateDirection) * Math.PI / 180;
                    }
                    newAngle = utils.normalizeAngle(newAngle);

                    var newX = combine.x - moveDirection * Math.cos(combine.angle) * linearDistEachFrame;
                    var newY = combine.y - moveDirection * Math.sin(combine.angle) * linearDistEachFrame;

                    var collision = false;
                    for (var i = 0; i < otherObjects.length; i++) {
                        if (utils.checkCollision(otherObjects[i], {
                                x: newX,
                                y: newY,
                                radius: combine.radius
                            })) {
                            collision = true;
                            break;
                        }
                    }

                    if (!collision) {
                        combine.x = newX;
                        combine.y = newY;
                        combine.angle = newAngle;
                        updateHeader();
                        updateBack();
                    }
                }
            }

            if (combine.workingTime > 0) {
                combine.workingTime -= timeDelta * combine.workingSpeed;
            }

            combine.updateAnimation(timeDiff);
        };

        combine.notifyShouldProcess = function () {
            if (combine.grain < combine.maxGrain) {
                combine.grain += 1;
            }
            combine.workingTime = combine.defaultWorkingTime;
        };

        combine.updateTrailer = function (timeDiff, trailer) {
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

        combine.draw = function () {
            combine.ctx.save();
            // combine.ctx.fillRect(combine.x, combine.y, 20, 20);
            combine.ctx.translate(combine.x, combine.y);
            combine.ctx.rotate(combine.angle);
            if (combine.isProcessing()) {
                ctx.drawImage(combine.sprite, combine.animationFrame * 20, 80, 20, 20, -combine.width + 20, -combine.height / 2 + 31, 20, 20);
            }
            combine.ctx.drawImage(combine.sprite, 0, 100, combine.width, combine.height, -combine.width + 30, -combine.height / 2, combine.width, combine.height);
            combine.ctx.restore();
            if (configuration.debug) {
                combine.ctx.beginPath();
                combine.ctx.arc(combine.getBoundingSphere().x, combine.getBoundingSphere().y, combine.getBoundingSphere().radius, 0, 2 * Math.PI, false);
                combine.ctx.stroke();
            }
        };

        combine.getBoundingSphere = function () {
            return {
                x: combine.x,
                y: combine.y,
                radius: combine.width / 2
            };
        };

        function updateHeader() {
            var diagonalAngle1 = combine.angle + combine.angleHeader;
            var diagonalAngle2 = combine.angle - combine.angleHeader;
            combine.header.x1 = Math.cos(diagonalAngle1) * combine.radiusHeader + combine.x;
            combine.header.y1 = Math.sin(diagonalAngle1) * combine.radiusHeader + combine.y;
            combine.header.x2 = Math.cos(diagonalAngle2) * combine.radiusHeader + combine.x;
            combine.header.y2 = Math.sin(diagonalAngle2) * combine.radiusHeader + combine.y;
        }

        function updateBack() {
            var diagonalAngleBack1 = combine.angle + combine.angleBack - 180 * Math.PI / 180; //flip to back of combine
            var diagonalAngleBack2 = combine.angle - combine.angleBack - 180 * Math.PI / 180; //flip to back of combine
            combine.back.x1 = Math.cos(diagonalAngleBack1) * combine.radiusBack + combine.x;
            combine.back.y1 = Math.sin(diagonalAngleBack1) * combine.radiusBack + combine.y;
            combine.back.x2 = Math.cos(diagonalAngleBack2) * combine.radiusBack + combine.x;
            combine.back.y2 = Math.sin(diagonalAngleBack2) * combine.radiusBack + combine.y;
        }

        return combine;
    };
});
