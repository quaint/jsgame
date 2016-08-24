define(['./vehicle', './utils', './configuration'], function (createVehicle, utils, configuration) {
    return function (x, y, width, height, maxFuel, sprite, ctx) {
        var tractor = createVehicle(x, y, width, height, sprite, ctx);
        tractor.linearSpeed = configuration.tractorLinearSpeed;
        tractor.fuel = maxFuel;
        tractor.maxFuel = maxFuel;
        tractor.anchorY = 0.5;
        tractor.anchorX = 0.1;
        tractor.radius = tractor.width * 0.4;

        tractor.update = function (timeDiff, rotateDirection, moveDirection, command, isActive, otherObjects) {
            if (isActive) {
                var timeDelta = timeDiff * 0.001;
                var linearDistEachFrame = tractor.linearSpeed * timeDelta;

                if (moveDirection !== 0) {
                    if (tractor.fuel > 0) {
                        tractor.fuel -= timeDelta;
                    } else {
                        tractor.fuel = 0;
                    }
                }

                if (tractor.fuel > 0) {
                    var newAngle = tractor.angle;
                    if (moveDirection == 1) {
                        newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                    } else if (moveDirection == -1) {
                        newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                    }
                    newAngle = utils.normalizeAngle(newAngle);

                    var newX = tractor.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                    var newY = tractor.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;

                    var collision = false;
                    for (var i = 0; i < otherObjects.length; i++) {
                        if (utils.checkCollision(otherObjects[i], {
                                x: newX + Math.cos(tractor.angle) * tractor.radius,
                                y: newY + Math.sin(tractor.angle) * tractor.radius,
                                radius: tractor.radius
                            })) {
                            collision = true;
                            break;
                        }
                    }

                    if (!collision) {
                        if (this.connectedObject) {
                            var firstConnectedObj = createCheckObject(this.connectedObject);
                            var canDragFirst = utils.drag(firstConnectedObj, {
                                x: newX,
                                y: newY,
                                angle: this.angle
                            }, otherObjects);
                            if (canDragFirst && this.connectedObject.connectedObject) {
                                var secondConnectedObj = createCheckObject(this.connectedObject.connectedObject);
                                var canDragSecond = utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                                if (canDragSecond) {
                                    updateObjectsPosition(this.connectedObject, firstConnectedObj);
                                    updateObjectsPosition(this.connectedObject.connectedObject, secondConnectedObj);
                                    updateObjectsPosition(tractor, {x: newX, y: newY, angle: newAngle});
                                }
                            }
                        }
                    }
                }
            }
        };

        function updateObjectsPosition(object, newObject) {
            object.x = newObject.x;
            object.y = newObject.y;
            object.angle = newObject.angle;
        }

        function createCheckObject(obj) {
            return {
                radius: obj.radius,
                width: obj.width,
                x: obj.x,
                y: obj.y,
                angle: obj.angle,
                getPin: function () {
                    return {
                        x: this.x + Math.cos(this.angle) * this.width,
                        y: this.y + Math.sin(this.angle) * this.width
                    };
                }
            };
        };

        tractor.draw = function () {
            tractor.ctx.save();
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 10, 10);
            tractor.ctx.translate(tractor.x, tractor.y);
            tractor.ctx.rotate(tractor.angle);
            tractor.ctx.drawImage(tractor.sprite, 0, 205, tractor.width, tractor.height, tractor.anchorX * -tractor.width, tractor.anchorY * -tractor.height, tractor.width, tractor.height);
            tractor.ctx.restore();
            if (configuration.debug) {
                tractor.ctx.beginPath();
                tractor.ctx.arc(tractor.getBoundingSphere().x, tractor.getBoundingSphere().y, tractor.getBoundingSphere().radius, 0, 2 * Math.PI, false);
                tractor.ctx.stroke();
            }
        };

        tractor.getBoundingSphere = function () {
            return {
                x: tractor.x + Math.cos(tractor.angle) * tractor.radius,
                y: tractor.y + Math.sin(tractor.angle) * tractor.radius,
                radius: tractor.radius
            }
        };

        return tractor;
    };
});
