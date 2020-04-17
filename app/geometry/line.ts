import Point from "./point";

export default class Line {

    start: Point;
    end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
}