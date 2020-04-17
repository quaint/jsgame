"use strict";
exports.__esModule = true;
var BarRenderer = /** @class */ (function () {
    function BarRenderer(ctx) {
        this.ctx = ctx;
    }
    BarRenderer.prototype.render = function (bar) {
        var barHeight = bar.level * bar.size.height;
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(bar.position.x, bar.position.y, bar.size.width, bar.size.height);
        if ((bar.warningBelow && bar.level < bar.warningLevel) ||
            (!bar.warningBelow && bar.level > bar.warningLevel)) {
            this.ctx.fillStyle = "#ff0000";
        }
        else {
            this.ctx.fillStyle = "#68c1e7";
        }
        this.ctx.fillRect(bar.position.x, bar.size.height + bar.position.y - barHeight, bar.size.width, barHeight);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(bar.position.x, bar.position.y, bar.size.width, bar.size.height);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(bar.title, bar.position.x, bar.position.y + bar.size.height + bar.textMargin);
        this.ctx.restore();
    };
    return BarRenderer;
}());
exports["default"] = BarRenderer;
//# sourceMappingURL=bar_renderer.js.map