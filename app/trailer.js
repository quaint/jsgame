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
var configuration_1 = require("./configuration");
var Trailer = (function (_super) {
    __extends(Trailer, _super);
    function Trailer(origin, size, maxGrain, sprite, ctx) {
        var _this = _super.call(this, origin, size, sprite, ctx) || this;
        _this.grain = 0;
        _this.maxGrain = maxGrain;
        _this.radius = _this.size.width * 0.3;
        _this.anchorY = 0.5;
        _this.anchorX = 0.0;
        _this.maxAngle = 55;
        return _this;
    }
    Trailer.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.origin.x, this.origin.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        // if (this.grain > 0) {
        //     this.ctx.drawImage(this.sprite, 20, 20, 20, 20, -this.width, -this.height / 2, this.width, this.height);
        // } else {
        this.ctx.drawImage(this.sprite, 0, 180, this.size.width, this.size.height, this.anchorX * -this.size.width, this.anchorY * -this.size.height, this.size.width, this.size.height);
        // }
        this.ctx.restore();
        if (configuration_1.default.debug) {
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().center.x, this.getBoundingSphere().center.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        // this.ctx.fillStyle = "rgb(0,0,0)";
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 6, 6);
        // this.ctx.fillRect(this.getBoundingSphere().x, this.getBoundingSphere().y, 10, 10);
        // this.ctx.fillStyle = "rgb(200,0,0)";
        // this.ctx.fillRect(this.x, this.y, 4, 4);
    };
    ;
    Trailer.prototype.getPin = function () {
        return {
            x: this.origin.x + Math.cos(this.angle) * this.size.width,
            y: this.origin.y + Math.sin(this.angle) * this.size.width
        };
    };
    Trailer.prototype.getBoundingSphere = function () {
        return {
            center: {
                x: this.origin.x + Math.cos(this.angle) * this.radius,
                y: this.origin.y + Math.sin(this.angle) * this.radius,
            },
            radius: this.radius
        };
    };
    return Trailer;
}(vehicle_1.default));
exports.default = Trailer;
