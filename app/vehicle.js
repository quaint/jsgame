"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vehicle = /** @class */ (function () {
    function Vehicle(origin, size, sprite, ctx) {
        this.angle = 0;
        this.maxAngle = 0;
        this.linearSpeed = 10;
        this.animationFrame = 0;
        this.animationDelta = 0;
        this.msPerFrame = 100;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.origin = origin;
        this.size = size;
        this.sprite = sprite;
        this.ctx = ctx;
        this.radius = size.width * 0.5;
    }
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
    Vehicle.prototype.distanceTo = function (otherObject) {
        var dx = this.origin.x - otherObject.origin.x;
        var dy = this.origin.y - otherObject.origin.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    return Vehicle;
}());
exports.default = Vehicle;
