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
var utils = require("../utils");
var vehicle_1 = require("./vehicle");
var configuration_1 = require("../configuration");
var point_1 = require("../geometry/point");
var line_1 = require("../geometry/line");
var size_1 = require("../geometry/size");
var Combine = /** @class */ (function (_super) {
    __extends(Combine, _super);
    function Combine(position, maxGrain, maxFuel, sprite, ctx) {
        var _this = _super.call(this, position, new size_1["default"](71, 80), sprite, ctx) || this;
        _this.linearSpeed = configuration_1["default"].combineLinearSpeed;
        _this.pouringSpeed = 100;
        _this.grain = 0;
        _this.maxGrain = maxGrain;
        _this.fuel = maxFuel;
        _this.maxFuel = maxFuel;
        _this.workingTime = 0;
        _this.defaultWorkingTime = 1000;
        _this.workingSpeed = 1000;
        _this.header = new line_1["default"](new point_1["default"](0, 0), new point_1["default"](0, 0));
        _this.back = new line_1["default"](new point_1["default"](0, 0), new point_1["default"](0, 0));
        _this.radiusHeader = _this.size.height / 2;
        _this.angleHeader = utils.toRadians(60);
        var backHeight = _this.size.height / 10;
        var centerToBack = _this.size.width - 30;
        _this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        _this.angleBack = Math.atan2(backHeight, centerToBack);
        _this.pouring = false;
        return _this;
    }
    Combine.prototype.isProcessing = function () {
        return this.workingTime > 0;
    };
    Combine.prototype.update = function (timeDiff, rotateDirection, moveDirection, command, isActive, otherObjects) {
        var timeDelta = timeDiff * 0.001;
        if (isActive) {
            this.pouring = command;
            if (moveDirection !== 0 || this.pouring) {
                this.updateFuel(timeDelta);
            }
            if (this.fuel > 0) {
                var linearDistEachFrame = this.linearSpeed * timeDelta;
                var newAngle = this.angle;
                if (moveDirection === 1) {
                    newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                }
                else if (moveDirection === -1) {
                    newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils.normalizeAngle(newAngle);
                this.newAngle = newAngle;
                var newX = this.position.x - moveDirection * Math.cos(this.angle) * linearDistEachFrame;
                var newY = this.position.y - moveDirection * Math.sin(this.angle) * linearDistEachFrame;
                this.newPosition = new point_1["default"](newX, newY);
                if (!this.isInCollision(otherObjects)) {
                    this.setPositionFromNew();
                    this.setAngleFromNew();
                    this.updateHeader();
                    this.updateBack();
                }
            }
        }
        if (this.workingTime > 0) {
            this.workingTime -= timeDelta * this.workingSpeed;
        }
        this.updateAnimation(timeDiff);
    };
    Combine.prototype.updateFuel = function (timeDelta) {
        if (this.fuel > 0) {
            this.fuel -= timeDelta;
        }
        else {
            this.fuel = 0;
        }
    };
    Combine.prototype.notifyShouldProcess = function () {
        if (this.grain < this.maxGrain) {
            this.grain += 1;
        }
        this.workingTime = this.defaultWorkingTime;
    };
    Combine.prototype.updateTrailer = function (timeDiff, trailer) {
        var timeDelta = timeDiff * 0.001;
        if (this.pouring) {
            var distance = utils.distanceBetween(this.position, trailer.position);
            if (this.grain > 0 && distance < this.size.width) {
                this.grain -= timeDelta * this.pouringSpeed;
                if (trailer.grain < trailer.maxGrain) {
                    trailer.grain += timeDelta * this.pouringSpeed;
                }
            }
        }
    };
    Combine.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        if (this.isProcessing()) {
            this.ctx.drawImage(this.sprite, this.animationFrame * 20, 80, 20, 20, -this.size.width + 20, -this.size.height / 2 + 31, 20, 20);
        }
        this.ctx.drawImage(this.sprite, 0, 100, this.size.width, this.size.height, this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        this.ctx.restore();
        _super.prototype.draw.call(this);
    };
    Combine.prototype.updateHeader = function () {
        var diagonalAngle1 = this.angle + this.angleHeader;
        var diagonalAngle2 = this.angle - this.angleHeader;
        this.header.start.x = Math.cos(diagonalAngle1) * this.radiusHeader + this.position.x;
        this.header.start.y = Math.sin(diagonalAngle1) * this.radiusHeader + this.position.y;
        this.header.end.x = Math.cos(diagonalAngle2) * this.radiusHeader + this.position.x;
        this.header.end.y = Math.sin(diagonalAngle2) * this.radiusHeader + this.position.y;
    };
    Combine.prototype.updateBack = function () {
        var diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of combine
        var diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of combine
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    };
    return Combine;
}(vehicle_1["default"]));
exports["default"] = Combine;
;
//# sourceMappingURL=combine.js.map