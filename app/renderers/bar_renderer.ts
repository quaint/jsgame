import Renderer from "./renderer";
import Bar from "../ui/bar";

export default class BarRenderer implements Renderer {

    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    render(bar: Bar): void {
        let barHeight = bar.level * bar.size.height;
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(bar.position.x, bar.position.y, bar.size.width, bar.size.height);
        if ((bar.warningBelow && bar.level < bar.warningLevel) ||
            (!bar.warningBelow && bar.level > bar.warningLevel)) {
            this.ctx.fillStyle = "#ff0000";
        } else {
            this.ctx.fillStyle = "#68c1e7";
        }
        this.ctx.fillRect(bar.position.x, bar.size.height + bar.position.y - barHeight, bar.size.width, barHeight);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(bar.position.x, bar.position.y, bar.size.width, bar.size.height);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(bar.title, bar.position.x, bar.position.y + bar.size.height + bar.textMargin);
        this.ctx.restore();
    }
}