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
var vehicle_1 = require("./vehicle");
var utils_1 = require("./utils");
var Machine = /** @class */ (function (_super) {
    __extends(Machine, _super);
    function Machine(origin, size, sprite, ctx) {
        var _this = _super.call(this, origin, size, sprite, ctx) || this;
        _this.radius = _this.size.width * 0.3;
        _this.anchorY = 0.5;
        _this.anchorX = 0.0;
        _this.maxAngle = 0;
        _this.workSpeed = 30;
        _this.back = {
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        };
        var backHeight = _this.size.height - 20;
        var centerToBack = _this.size.width - 15;
        _this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        _this.angleBack = Math.atan2(backHeight, centerToBack);
        return _this;
    }
    Machine.prototype.updateBack = function () {
        var diagonalAngleBack1 = this.angle + this.angleBack - utils_1.utils.toRadians(180); //flip to back of this
        var diagonalAngleBack2 = this.angle - this.angleBack - utils_1.utils.toRadians(180); //flip to back of this
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.origin.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.origin.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.origin.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.origin.y;
    };
    Machine.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.origin.x, this.origin.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        this.ctx.drawImage(this.sprite, 0, 230, this.size.width, this.size.height, this.anchorX * -this.size.width, this.anchorY * -this.size.height, this.size.width, this.size.height);
        this.ctx.restore();
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.back.x1, this.back.y1);
        // this.ctx.lineTo(this.back.x2, this.back.y2);
        // this.ctx.stroke();
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 4, 4);
        // this.ctx.fillRect(this.x, this.y, 5, 5);
    };
    Machine.prototype.getPin = function () {
        return {
            x: this.origin.x + Math.cos(this.angle) * this.size.width,
            y: this.origin.y + Math.sin(this.angle) * this.size.width
        };
    };
    return Machine;
}(vehicle_1.default));
exports.default = Machine;
