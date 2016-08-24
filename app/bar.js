define(function () {
    return function (x, y, maxValue, warningLevel, warningBelow, ctx, title) {
        return {
            x: x,
            y: y,
            width: 20,
            height: 100,
            textMargin: 12,
            level: 0,
            maxValue: maxValue,
            warningLevel: warningLevel,
            warningBelow: warningBelow,
            ctx: ctx,
            title: title,

            update: function (level) {
                this.level = level / this.maxValue * this.height;
            },

            draw: function () {
                this.ctx.save();
                this.ctx.fillStyle = "#ffffff";
                this.ctx.fillRect(this.x, this.y, this.width, this.height);
                if ((this.warningBelow && this.level < this.warningLevel) || (!this.warningBelow && this.level > this.warningLevel)) {
                    this.ctx.fillStyle = "#ff0000";
                } else {
                    this.ctx.fillStyle = "#68c1e7";
                }
                this.ctx.fillRect(this.x, this.height + this.y - this.level, this.width, this.level);
                this.ctx.strokeStyle = "#000000";
                this.ctx.strokeRect(this.x, this.y, this.width, this.height);
                this.ctx.fillStyle = "#000000";
                this.ctx.fillText(this.title, this.x, this.y + this.height + this.textMargin);
                this.ctx.restore();
            }
        }
    };
});
