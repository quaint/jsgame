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
    function Trailer(position, size, maxGrain, sprite, ctx) {
        var _this = _super.call(this, position, size, sprite, ctx) || this;
        _this.grain = 0;
        _this.maxGrain = maxGrain;
        _this.maxAngle = configuration_1["default"].maxAngle;
        return _this;
    }
    Trailer.prototype.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle); // * Math.PI / 180
        // if (this.grain > 0) {
        //     this.ctx.drawImage(this.sprite, 20, 20, 20, 20, -this.size.width, -this.size.height / 2, this.size.width, this.size.height);
        // } else {
        this.ctx.drawImage(this.sprite, 0, 180, this.size.width, this.size.height, this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        // }
        this.ctx.restore();
        _super.prototype.draw.call(this);
    };
    return Trailer;
}(vehicle_1["default"]));
exports["default"] = Trailer;
//# sourceMappingURL=trailer.js.map