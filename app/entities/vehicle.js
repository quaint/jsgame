"use strict";
exports.__esModule = true;
var point_1 = require("../geometry/point");
var sphere_1 = require("../geometry/sphere");
var utils = require("../utils");
var Vehicle = /** @class */ (function () {
    function Vehicle(position, size, anchor, sprite, ctx) {
        this.position = position;
        this.size = size;
        this.sprite = sprite;
        this.ctx = ctx;
        this.anchor = anchor;
        this.boundingSphereRadius = utils.max(size.width, size.height) * 0.5;
        this.angle = 0;
        this.linearSpeed = 10;
        this.connectedObject = null;
        this.xDiff = -this.size.width * (this.anchor.x - 0.5);
        this.pivot = new point_1["default"](-this.size.width * this.anchor.x, -this.size.height * this.anchor.y);
        this.msPerFrame = 100;
        this.animationFrame = 0;
        this.animationDelta = 0;
    }
    Vehicle.prototype.getBoundingSphere = function () {
        return new sphere_1["default"](new point_1["default"](this.position.x + this.xDiff, this.position.y), this.boundingSphereRadius);
    };
    Vehicle.prototype.getPin = function () {
        return new point_1["default"](this.position.x + Math.cos(this.angle) * this.size.width, this.position.y + Math.sin(this.angle) * this.size.width);
    };
    Vehicle.prototype.updateAnimation = function (timeDiff) {
        if (this.animationDelta > this.msPerFrame) {
            this.animationDelta = 0;
            this.animationFrame++;
            if (this.animationFrame > 1) {
                this.animationFrame = 0;
            }
        }
        else {
            this.animationDelta += timeDiff;
        }
    };
    Vehicle.prototype.distanceTo = function (position) {
        var dx = this.position.x - position.x;
        var dy = this.position.y - position.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    return Vehicle;
}());
exports["default"] = Vehicle;
//# sourceMappingURL=vehicle.js.map