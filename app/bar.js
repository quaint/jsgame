define(function() {
    return function(x, y, maxValue, warningLevel, warningBelow, ctx, title) {

        var bar = {
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
            title: title
        };

        bar.update = function(level) {
            bar.level = level / bar.maxValue * bar.height;
        };

        bar.draw = function() {
            bar.ctx.save();
            bar.ctx.fillStyle = "#ffffff";
            bar.ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
            if ((bar.warningBelow && bar.level < bar.warningLevel) || (!bar.warningBelow && bar.level > bar.warningLevel)) {
                bar.ctx.fillStyle = "#ff0000";
            } else {
                bar.ctx.fillStyle = "#68c1e7";
            }
            bar.ctx.fillRect(bar.x, bar.height + bar.y - bar.level, bar.width, bar.level);
            bar.ctx.strokeStyle = "#000000";
            bar.ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
            bar.ctx.fillStyle = "#000000";
            bar.ctx.fillText(bar.title, bar.x, bar.y + bar.height + bar.textMargin);
            bar.ctx.restore();
        };

        return bar;
    };
});
