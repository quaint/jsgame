import Size from "../geometry/size";
import Point from "../geometry/point";

export default class Bar {
    position: Point;
    size: Size;
    textMargin: number;
    level: number;
    warningLevel: number;
    warningBelow: boolean;
    title: string;
    
    constructor(position: Point, warningLevel: number, warningBelow: boolean, title: string) {
        this.position = position;
        this.size = new Size(20, 100);
        this.textMargin = 12;

        this.level = 0;
        this.warningLevel = warningLevel;
        this.warningBelow = warningBelow;
        this.title = title;
    }

    update(level: number): void {
        this.level = level;
    }

}