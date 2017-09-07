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
var Machine = (function (_super) {
    __extends(Machine, _super);
    function Machine(origin, size, sprite, ctx) {
        var _this = _super.call(this, origin, size, sprite, ctx) || this;
        var ;
        _this = createVehicle(x, y, width, height, sprite, ctx);
        _this.radius = _this.width * 0.3;
        _this.anchorY = 0.5;
        _this.anchorX = 0.0;
        _this.maxAngle = 0;
        _this.workSpeed = 30;
        _this.back = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        var backHeight = _this.height - 20;
        var centerToBack = _this.width - 15;
        _this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        _this.angleBack = Math.atan2(backHeight, centerToBack);
        return _this;
    }
    Machine.prototype.updateBack = function () {
        var diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of this
        var diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of this
        this.back.x1 = Math.cos(diagonalAngleBack1) * this.radiusBack + this.x;
        this.back.y1 = Math.sin(diagonalAngleBack1) * this.radiusBack + this.y;
        this.back.x2 = Math.cos(diagonalAngleBack2) * this.radiusBack + this.x;
        this.back.y2 = Math.sin(diagonalAngleBack2) * this.radiusBack + this.y;
    };
    Machine.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        this.ctx.drawImage(this.sprite, 0, 230, this.width, this.height, this.anchorX * -this.width, this.anchorY * -this.height, this.width, this.height);
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
            x: this.x + Math.cos(this.angle) * this.width,
            y: this.y + Math.sin(this.angle) * this.width
        };
    };
    return Machine;
}(vehicle_1.default));
exports.default = Machine;
