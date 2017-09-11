"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var machine_1 = require("./machine");
var configuration_1 = require("./configuration");
var utils_1 = require("./utils");
var Tractor = /** @class */ (function (_super) {
    __extends(Tractor, _super);
    function Tractor(origin, size, maxFuel, sprite, ctx) {
        var _this = _super.call(this, origin, size, sprite, ctx) || this;
        _this.linearSpeed = configuration_1.default.tractorLinearSpeed;
        _this.fuel = maxFuel;
        _this.maxFuel = maxFuel;
        _this.anchorY = 0.5;
        _this.anchorX = 0.0;
        _this.radius = _this.size.width * 0.4;
        return _this;
    }
    Tractor.prototype.update = function (timeDiff, rotateDirection, moveDirection, isActive, otherObjects) {
        if (isActive) {
            var timeDelta = timeDiff * 0.001;
            if (this.connectedObject.workSpeed) {
                this.linearSpeed = this.connectedObject.workSpeed;
            }
            var linearDistEachFrame = this.linearSpeed * timeDelta;
            if (moveDirection !== 0) {
                if (this.fuel > 0) {
                    this.fuel -= timeDelta;
                }
                else {
                    this.fuel = 0;
                }
            }
            if (this.fuel > 0) {
                var newAngle = this.angle;
                if (moveDirection === 1) {
                    newAngle += utils_1.utils.toRadians(linearDistEachFrame * -rotateDirection);
                }
                else if (moveDirection === -1) {
                    newAngle += utils_1.utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils_1.utils.normalizeAngle(newAngle);
                var newX = this.origin.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                var newY = this.origin.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;
                var collision = false;
                for (var i = 0; i < otherObjects.length; i++) {
                    if (utils_1.utils.checkCollision(otherObjects[i], {
                        origin: {
                            x: newX + Math.cos(this.angle) * this.radius,
                            y: newY + Math.sin(this.angle) * this.radius
                        },
                        radius: this.radius
                    })) {
                        collision = true;
                        break;
                    }
                }
                if (!collision) {
                    if (this.connectedObject) {
                        var firstConnectedObj = this.createCheckObject(this.connectedObject);
                        var canDragFirst = utils_1.utils.drag(firstConnectedObj, {
                            origin: {
                                x: newX,
                                y: newY
                            },
                            size: {
                                width: 0,
                                height: 0
                            },
                            angle: this.angle,
                            maxAngle: this.maxAngle,
                            radius: 0,
                            getPin: function () {
                                return {
                                    x: 0,
                                    y: 0
                                };
                            }
                        }, otherObjects);
                        if (canDragFirst && this.connectedObject.connectedObject) {
                            var secondConnectedObj = this.createCheckObject(this.connectedObject.connectedObject);
                            var canDragSecond = utils_1.utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                            if (canDragSecond) {
                                this.updateObjectsPosition(this.connectedObject, firstConnectedObj);
                                this.updateObjectsPosition(this.connectedObject.connectedObject, secondConnectedObj);
                                this.updateObjectsPosition(this, { origin: { x: newX, y: newY }, angle: newAngle });
                            }
                        }
                        else if (canDragFirst) {
                            this.updateObjectsPosition(this.connectedObject, firstConnectedObj);
                            this.updateObjectsPosition(this, { origin: { x: newX, y: newY }, angle: newAngle });
                        }
                    }
                    else {
                        this.updateObjectsPosition(this, { origin: { x: newX, y: newY }, angle: newAngle });
                    }
                }
            }
        }
    };
    Tractor.prototype.updateObjectsPosition = function (object, newObject) {
        object.origin.x = newObject.origin.x;
        object.origin.y = newObject.origin.y;
        object.angle = newObject.angle;
    };
    Tractor.prototype.createCheckObject = function (obj) {
        return {
            radius: obj.radius,
            size: {
                width: obj.size.width,
                height: 0
            },
            origin: {
                x: obj.origin.x,
                y: obj.origin.y
            },
            angle: obj.angle,
            maxAngle: obj.maxAngle,
            getPin: function () {
                var result = {
                    x: this.origin.x + Math.cos(this.angle) * (this.size.width - 0),
                    y: this.origin.y + Math.sin(this.angle) * (this.size.width - 0)
                };
                return result;
            }
        };
    };
    Tractor.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.origin.x, this.origin.y);
        this.ctx.rotate(this.angle);
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        this.ctx.drawImage(this.sprite, 0, 205, this.size.width, this.size.height, this.anchorX * -this.size.width, this.anchorY * -this.size.height, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration_1.default.debug) {
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().origin.x, this.getBoundingSphere().origin.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        // this.ctx.fillRect(this.x, this.y, 5, 5);
    };
    Tractor.prototype.getBoundingSphere = function () {
        return {
            origin: {
                x: this.origin.x + Math.cos(this.angle) * this.radius,
                y: this.origin.y + Math.sin(this.angle) * this.radius,
            },
            radius: this.radius
        };
    };
    Tractor.prototype.getPin = function () {
        return {
            x: 0,
            y: 0
        };
    };
    return Tractor;
}(machine_1.default));
exports.default = Tractor;
