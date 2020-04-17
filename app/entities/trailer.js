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
var configuration_1 = require("../configuration");
var vehicle_1 = require("./vehicle");
var Trailer = /** @class */ (function (_super) {
    __extends(Trailer, _super);
    function Trailer(position, size, anchor, maxGrain, sprite, ctx) {
        var _this = _super.call(this, position, size, anchor, sprite, ctx) || this;
        _this.grain = 0;
        _this.maxGrain = maxGrain;
        _this.maxAngle = configuration_1["default"].maxAngle;
        return _this;
    }
    Trailer.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        // if (this.grain > 0) {
        //     this.ctx.drawImage(this.sprite, 20, 20, 20, 20, -this.size.width, -this.size.height / 2, this.size.width, this.size.height);
        // } else {
        this.ctx.drawImage(this.sprite, 0, 180, this.size.width, this.size.height, this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        // }
        this.ctx.restore();
        if (configuration_1["default"].debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().position.x, this.getBoundingSphere().position.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.fillRect(this.getPin().x, this.getPin().y, 2, 2);
            this.ctx.stroke();
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
        // this.ctx.fillStyle = "rgb(0,0,0)";
        // this.ctx.fillRect(this.getPin().x, this.getPin().y, 6, 6);
        // this.ctx.fillRect(this.getBoundingSphere().x, this.getBoundingSphere().y, 10, 10);
        // this.ctx.fillStyle = "rgb(200,0,0)";
        // this.ctx.fillRect(this.position.x, this.position.y, 4, 4);
    };
    return Trailer;
}(vehicle_1["default"]));
exports["default"] = Trailer;
//# sourceMappingURL=trailer.js.map