define(function() {
    return function(x, y, warningLevel, below, ctx, title) {

        var bar = {
            x: x,
            y: y,
            level: 0,
            warningLevel: warningLevel,
            below: below,
            ctx: ctx,
            title: title
        };

        bar.update = function(level) {
            bar.level = level;
        };

        bar.draw = function() {
            bar.ctx.save();
            bar.ctx.fillStyle = "#ffffff";
            bar.ctx.fillRect(bar.x, bar.y, 20, 100);
            if (bar.below && bar.level < bar.warningLevel) {
                bar.ctx.fillStyle = "#ff0000";
            } else if (!bar.below && bar.level > bar.warningLevel) {
                bar.ctx.fillStyle = "#ff0000";
            } else {
                bar.ctx.fillStyle = "#68c1e7";
            }
            bar.ctx.fillRect(bar.x, 100 + bar.y - bar.level, 20, bar.level);
            bar.ctx.strokeStyle = "#000000";
            bar.ctx.strokeRect(bar.x, bar.y, 20, 100);
            bar.ctx.fillStyle = "#000000";
            bar.ctx.fillText(bar.title, bar.x, bar.y + 100 + 12);
            bar.ctx.restore();
        };

        return bar;
    };
});
