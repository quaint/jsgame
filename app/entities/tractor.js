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
        _this.timeMultiplier = 0.001;
        _this.linearSpeed = configuration_1["default"].tractorLinearSpeed;
        _this.fuel = maxFuel;
        _this.maxFuel = maxFuel;
        return _this;
    }
    Tractor.prototype.update = function (timeDiff, rotateDirection, moveDirection, isActive, otherObjects) {
        if (!isActive) {
            return;
        }
        this.adjustLinearSpeedTo(this.connectedObject);
        var timeDelta = timeDiff * this.timeMultiplier;
        var linearDistEachFrame = this.linearSpeed * timeDelta;
        this.updateFuel(timeDelta, moveDirection);
        if (this.fuel > 0) {
            this.updateAngle(moveDirection, linearDistEachFrame, rotateDirection);
            this.updatePosition(moveDirection, linearDistEachFrame);
            if (!this.isInCollision(otherObjects)) {
                if (!this.connectedObject) {
                    this.setPositionFromNew();
                    this.setAngleFromNew();
                    return;
                }
                this.connectedObject.dragFromPointAngleAndSetNewPosition(this.getBackPin(), this.newAngle);
                if (!this.connectedObject.isInCollision(otherObjects)) {
                    if (!this.connectedObject.connectedObject) {
                        this.setPositionFromNew();
                        this.setAngleFromNew();
                        this.connectedObject.setPositionFromNew();
                        this.connectedObject.setAngleFromNew();
                        return;
                    }
                    this.connectedObject.connectedObject.dragFromPointAngleAndSetNewPosition(this.connectedObject.getBackPin(), this.connectedObject.newAngle);
                    if (!this.connectedObject.connectedObject.isInCollision(otherObjects)) {
                        this.setPositionFromNew();
                        this.setAngleFromNew();
                        this.connectedObject.setPositionFromNew();
                        this.connectedObject.setAngleFromNew();
                        this.connectedObject.connectedObject.setPositionFromNew();
                        this.connectedObject.connectedObject.setAngleFromNew();
                    }
                }
            }
        }
    };
    ;
    Tractor.prototype.updatePosition = function (moveDirection, linearDistEachFrame) {
        var newX = this.position.x - moveDirection * Math.cos(this.newAngle) * linearDistEachFrame;
        var newY = this.position.y - moveDirection * Math.sin(this.newAngle) * linearDistEachFrame;
        this.newPosition = new point_1["default"](newX, newY);
    };
    Tractor.prototype.updateAngle = function (moveDirection, linearDistEachFrame, rotateDirection) {
        var newAngle = this.angle;
        if (moveDirection === 1) {
            newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
        }
        else if (moveDirection === -1) {
            newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
        }
        newAngle = utils.normalizeAngle(newAngle);
        this.newAngle = newAngle;
    };
    Tractor.prototype.adjustLinearSpeedTo = function (object) {
        if (object.workSpeed) {
            this.linearSpeed = object.workSpeed;
        }
    };
    Tractor.prototype.updateFuel = function (timeDelta, moveDirection) {
        if (moveDirection !== 0) {
            if (this.fuel > 0) {
                this.fuel -= timeDelta;
            }
            else {
                this.fuel = 0;
            }
        }
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