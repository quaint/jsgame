"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var point_1 = require("../geometry/point");
var Tractor = /** @class */ (function (_super) {
    __extends(Tractor, _super);
    function Tractor(position, size, maxFuel, sprite, ctx) {
        var _this = _super.call(this, position, size, sprite, ctx) || this;
        _this.linearSpeed = configuration_1["default"].tractorLinearSpeed;
        _this.fuel = maxFuel;
        _this.maxFuel = maxFuel;
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
                this.updateFuel(timeDelta);
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
                this.newAngle = newAngle;
                var newX = this.position.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                var newY = this.position.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;
                this.newPosition = new point_1["default"](newX, newY);
                if (!this.isInCollision(otherObjects)) {
                    this.setPositionFromNew();
                    this.setAngleFromNew();
                    if (this.connectedObject) {
                        this.connectedObject.dragFromPointAngleAndSetNewPosition(this.getBackPin(), this.angle);
                        // if (!this.connectedObject.isInCollision(otherObjects)) {
                        //     this.connectedObject.setPositionFromNew();
                        //     this.connectedObject.setAngleFromNew();
                        // }
                        if (this.connectedObject.connectedObject) {
                            this.connectedObject.connectedObject.dragFromPointAngleAndSetNewPosition(this.connectedObject.getBackPin(), this.connectedObject.angle);
                            // if (!this.connectedObject.connectedObject.isInCollision(otherObjects)) {
                            //     this.connectedObject.connectedObject.setPositionFromNew();
                            //     this.connectedObject.connectedObject.setAngleFromNew();
                            // }
                        }
                    }
                    // if (this.connectedObject) {
                    //     let firstConnectedObj = this.createCheckObject(this.connectedObject);
                    //     let newObj = {
                    //         position: new Point(newX, newY),
                    //         angle: this.angle,
                    //         maxAngle: this.maxAngle,
                    //     };
                    //     let canDragFirst = utils.drag(firstConnectedObj, newObj, otherObjects);
                    //     if (canDragFirst && this.connectedObject.connectedObject) {
                    //         let secondConnectedObj = this.createCheckObject(this.connectedObject.connectedObject);
                    //         let canDragSecond = utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                    //         if (canDragSecond) {
                    //             utils.updatePositionAndAngle(this.connectedObject, firstConnectedObj);
                    //             utils.updatePositionAndAngle(this.connectedObject.connectedObject, secondConnectedObj);
                    //             let newObj = {position: new Point(newX, newY), angle: newAngle};
                    //             utils.updatePositionAndAngle(this, newObj);
                    //         }
                    //     } else if (canDragFirst) {
                    //         utils.updatePositionAndAngle(this.connectedObject, firstConnectedObj);
                    //         let newObj = {position: new Point(newX, newY), angle: newAngle};
                    //         utils.updatePositionAndAngle(this, newObj);
                    //     }
                    // } else {
                    //     let newObj = {position: new Point(newX, newY), angle: newAngle};
                    //     utils.updatePositionAndAngle(this, newObj);
                    // }
                }
            }
        }
    };
    ;
    Tractor.prototype.updateFuel = function (timeDelta) {
        if (this.fuel > 0) {
            this.fuel -= timeDelta;
        }
        else {
            this.fuel = 0;
        }
    };
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
        this.ctx.drawImage(this.sprite, 0, 205, this.size.width, this.size.height, this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        this.ctx.restore();
        _super.prototype.draw.call(this);
    };
    return Tractor;
}(vehicle_1["default"]));
exports["default"] = Tractor;
//# sourceMappingURL=tractor.js.map