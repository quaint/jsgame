define(['./vehicle', './utils', './configuration'], function (createVehicle, utils, configuration) {
    return function (x, y, width, height, maxFuel, sprite, ctx) {
        var tractor = createVehicle(x, y, width, height, sprite, ctx);
        tractor.linearSpeed = configuration.tractorLinearSpeed;
        tractor.fuel = maxFuel;
        tractor.maxFuel = maxFuel;

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
                    if (moveDirection == 1) {
                        tractor.angle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                    } else if (moveDirection == -1) {
                        tractor.angle += utils.toRadians(linearDistEachFrame * rotateDirection);
                    }

                    tractor.angle = utils.normalizeAngle(tractor.angle);

                    var newX = tractor.x - moveDirection * Math.cos(tractor.angle) * linearDistEachFrame;
                    var newY = tractor.y - moveDirection * Math.sin(tractor.angle) * linearDistEachFrame;

                    var collision = false;
                    for (var i = 0; i < otherObjects.length; i++) {
                        if (utils.checkCollision(otherObjects[i], {x: newX, y: newY, radius: tractor.radius})) {
                            collision = true;
                            break;
                        }
                    }

                    //TODO: remove redundancy
                    if (!collision) {
                        if (this.connectedObject) {
                            var moveCheckObject = {
                                radius: this.connectedObject.radius,
                                width: this.connectedObject.width,
                                x: this.connectedObject.x,
                                y: this.connectedObject.y,
                                angle: this.connectedObject.angle,
                                getPin: function () {
                                    return {
                                        x: this.x + Math.cos(this.angle) * this.width,
                                        y: this.y + Math.sin(this.angle) * this.width
                                    };
                                }
                            };
                            var canDrag = utils.drag(moveCheckObject, {x: newX, y: newY, angle: this.angle}, otherObjects);
                            if (canDrag) {
                                if (this.connectedObject.connectedObject) {
                                    var moveAlsoCheckObject = {
                                        radius: this.connectedObject.connectedObject.radius,
                                        width: this.connectedObject.connectedObject.width,
                                        x: this.connectedObject.connectedObject.x,
                                        y: this.connectedObject.connectedObject.y,
                                        angle: this.connectedObject.connectedObject.angle,
                                        getPin: function () {
                                            return {
                                                x: this.x + Math.cos(this.angle) * this.width,
                                                y: this.y + Math.sin(this.angle) * this.width
                                            };
                                        }
                                    };
                                    var canAlsoDrag = utils.drag(moveAlsoCheckObject, moveCheckObject, otherObjects);
                                    if (canAlsoDrag) {
                                        this.connectedObject.x = moveCheckObject.x;
                                        this.connectedObject.y = moveCheckObject.y;
                                        this.connectedObject.angle = moveCheckObject.angle;
                                        this.connectedObject.connectedObject.x = moveAlsoCheckObject.x;
                                        this.connectedObject.connectedObject.y = moveAlsoCheckObject.y;
                                        this.connectedObject.connectedObject.angle = moveAlsoCheckObject.angle;
                                        tractor.x = newX;
                                        tractor.y = newY;

                                    }
                                }
                            }
                        }
                    }

                }
            }
        };

        tractor.draw = function () {
            tractor.ctx.save();
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 10, 10);
            tractor.ctx.translate(tractor.x, tractor.y);
            tractor.ctx.rotate(tractor.angle);
            tractor.ctx.drawImage(tractor.sprite, 0, 205, tractor.width, tractor.height, -2, -tractor.height / 2, tractor.width, tractor.height);
            tractor.ctx.restore();
            tractor.ctx.beginPath();
            tractor.ctx.arc(tractor.getBoundingSphere().x, tractor.getBoundingSphere().y, tractor.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            tractor.ctx.stroke();
        };

        tractor.getBoundingSphere = function () {
            return {
                x: tractor.x + Math.cos(tractor.angle) * tractor.width / 2,
                y: tractor.y + Math.sin(tractor.angle) * tractor.width / 2,
                radius: tractor.width / 2
            }
        };

        return tractor;
    };
});
