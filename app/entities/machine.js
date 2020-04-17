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
var utils = require("../utils");
var point_1 = require("../geometry/point");
var line_1 = require("../geometry/line");
var configuration_1 = require("../configuration");
var Machine = /** @class */ (function (_super) {
    __extends(Machine, _super);
    function Machine(position, size, anchor, sprite, ctx) {
        var _this = _super.call(this, position, size, anchor, sprite, ctx) || this;
        _this.radius = _this.size.height / 2;
        _this.maxAngle = 0;
        _this.workSpeed = 30;
        _this.back = new line_1["default"](new point_1["default"](0, 0), new point_1["default"](0, 0));
        var backHeight = 20;
        var centerToBack = -5;
        _this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        _this.angleBack = Math.atan2(backHeight, centerToBack);
        return _this;
    }
    Machine.prototype.updateBack = function () {
        var diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of machine
        var diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of machine
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    };
    Machine.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        this.ctx.drawImage(this.sprite, 0, 230, this.size.width, this.size.height, this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration_1["default"].debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            this.ctx.moveTo(this.back.start.x, this.back.start.y);
            this.ctx.lineTo(this.back.end.x, this.back.end.y);
            this.ctx.stroke();
            this.ctx.fillRect(this.getPin().x, this.getPin().y, 2, 2);
            // this.ctx.fillRect(this.position.x, this.position.y, 5, 5);
            this.ctx.beginPath();
            var boundingSphere = this.getBoundingSphere();
            this.ctx.arc(boundingSphere.position.x, boundingSphere.position.y, boundingSphere.radius, 0, 2 * Math.PI, false);
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
    };
    return Machine;
}(vehicle_1["default"]));
exports["default"] = Machine;
//# sourceMappingURL=machine.js.map