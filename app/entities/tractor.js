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
exports.__esModule = true;
var vehicle_1 = require("./vehicle");
var configuration_1 = require("../configuration");
var utils = require("../utils");
var sphere_1 = require("../geometry/sphere");
var point_1 = require("../geometry/point");
var Tractor = /** @class */ (function (_super) {
    __extends(Tractor, _super);
    function Tractor(position, size, anchor, maxFuel, sprite, ctx) {
        var _this = _super.call(this, position, size, anchor, sprite, ctx) || this;
        _this.linearSpeed = configuration_1["default"].tractorLinearSpeed;
        _this.fuel = maxFuel;
        _this.maxFuel = maxFuel;
        _this.radius = _this.size.width * 0.5;
        return _this;
    }
    Tractor.prototype.update = function (timeDiff, rotateDirection, moveDirection, command, isActive, otherObjects) {
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
                    newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                }
                else if (moveDirection === -1) {
                    newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils.normalizeAngle(newAngle);
                var newX = this.position.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                var newY = this.position.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;
                var collision = false;
                var newBoundingSphere = this.createBoundingSphere(new point_1["default"](newX, newY));
                for (var i = 0; i < otherObjects.length; i++) {
                    var otherBoundingSphere = otherObjects[i].getBoundingSphere();
                    if (utils.checkCollision(otherBoundingSphere, newBoundingSphere)) {
                        collision = true;
                        break;
                    }
                }
                if (!collision) {
                    if (this.connectedObject) {
                        var firstConnectedObj = this.createCheckObject(this.connectedObject);
                        var newObj = {
                            position: new point_1["default"](newX, newY),
                            angle: this.angle,
                            maxAngle: this.maxAngle
                        };
                        var canDragFirst = utils.drag(firstConnectedObj, newObj, otherObjects);
                        if (canDragFirst && this.connectedObject.connectedObject) {
                            var secondConnectedObj = this.createCheckObject(this.connectedObject.connectedObject);
                            var canDragSecond = utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                            if (canDragSecond) {
                                updateObjectsPosition(this.connectedObject, firstConnectedObj);
                                updateObjectsPosition(this.connectedObject.connectedObject, secondConnectedObj);
                                var newObj_1 = { position: new point_1["default"](newX, newY), angle: newAngle };
                                updateObjectsPosition(this, newObj_1);
                            }
                        }
                        else if (canDragFirst) {
                            updateObjectsPosition(this.connectedObject, firstConnectedObj);
                            var newObj_2 = { position: new point_1["default"](newX, newY), angle: newAngle };
                            updateObjectsPosition(this, newObj_2);
                        }
                    }
                    else {
                        var newObj = { position: new point_1["default"](newX, newY), angle: newAngle };
                        updateObjectsPosition(this, newObj);
                    }
                }
            }
        }
    };
    ;
    Tractor.prototype.createCheckObject = function (obj) {
        return {
            radius: obj.boundingSphereRadius,
            size: obj.size,
            position: obj.position,
            angle: obj.angle,
            maxAngle: obj.maxAngle,
            getPin: function () {
                return new point_1["default"](this.position.x + Math.cos(this.angle) * (this.size.width - 0), this.position.y + Math.sin(this.angle) * (this.size.width - 0));
            }
        };
    };
    Tractor.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        this.ctx.drawImage(this.sprite, 0, 205, this.size.width, this.size.height, this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration_1["default"].debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            var boundingSphere = this.getBoundingSphere();
            this.ctx.arc(boundingSphere.position.x, boundingSphere.position.y, boundingSphere.radius, 0, 2 * Math.PI, false);
            // this.ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
        // this.ctx.fillRect(this.position.x, this.position.y, 5, 5);
    };
    Tractor.prototype.createBoundingSphere = function (point) {
        return new sphere_1["default"](new point_1["default"](point.x + Math.cos(this.angle) * this.radius, point.y + Math.sin(this.angle) * this.radius), this.radius);
    };
    return Tractor;
}(vehicle_1["default"]));
exports["default"] = Tractor;
function updateObjectsPosition(object, newObject) {
    object.position = newObject.position;
    object.angle = newObject.angle;
}
//# sourceMappingURL=tractor.js.map