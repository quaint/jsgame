export default class Bar {

    x: number
    y: number
    width: number
    height: number
    textMargin: number
    level: number
    maxValue: number
    warningLevel: number
    warningBelow: number
    ctx: CanvasRenderingContext2D
    title: string

    constructor(x: number, y: number, maxValue: number, warningLevel: number, warningBelow: number, ctx: CanvasRenderingContext2D, title: string) {
        this.x = x
        this.y = y
        this.width = 20
        this.height = 100
        this.textMargin = 12
        this.level = 0
        this.maxValue = maxValue
        this.warningLevel = warningLevel
        this.warningBelow = warningBelow
        this.ctx = ctx
        this.title = title
    }

    update(level: number): void {
        this.level = level / this.maxValue * this.height;
    }

    draw(): void {
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