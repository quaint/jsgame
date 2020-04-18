import Size from "../geometry/size";
import Point from "../geometry/point";

export default class Bar {

    position: Point;
    size: Size;
    textMargin: number;
    title: string;
    level: number;
    warningLevel: number;
    warningBelow: boolean;

    constructor(position: Point, warningLevel: number, warningBelow: boolean, title: string) {
        this.position = position;
        this.warningLevel = warningLevel;
        this.warningBelow = warningBelow;
        this.title = title;

        this.size = new Size(20, 100);
        this.textMargin = 12;
        this.level = 0;
    }

    updateLevel(level: number): void {
        this.level = level;
    }

}