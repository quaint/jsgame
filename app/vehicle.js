"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vehicle = (function () {
    function Vehicle(x, y, width, height, sprite, ctx) {
        this.angle = 0;
        this.linearSpeed = 10;
        this.animationFrame = 0;
        this.animationDelta = 0;
        this.msPerFrame = 100;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.ctx = ctx;
        this.radius = width * 0.5;
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
        var dx = this.x - otherObject.x;
        var dy = this.y - otherObject.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    return Vehicle;
}());
exports.default = Vehicle;
