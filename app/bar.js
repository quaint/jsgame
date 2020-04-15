import Size from "./size";

export default class Bar {
    constructor(position, maxValue, warningLevel, warningBelow, ctx, title) {
        this.position = position;
        this.size = new Size(20, 100);
        this.textMargin = 12;
        this.level = 0;
        this.maxValue = maxValue;
        this.warningLevel = warningLevel;
        this.warningBelow = warningBelow;
        this.ctx = ctx;
        this.title = title;
    }

    update(level) {
        this.level = level / this.maxValue * this.size.height;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        if ((this.warningBelow && this.level < this.warningLevel) || (!this.warningBelow && this.level > this.warningLevel)) {
            this.ctx.fillStyle = "#ff0000";
        } else {
            this.ctx.fillStyle = "#68c1e7";
        }
        this.ctx.fillRect(this.position.x, this.size.height + this.position.y - this.level, this.size.width, this.level);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(this.title, this.position.x, this.position.y + this.size.height + this.textMargin);
        this.ctx.restore();
    }
}