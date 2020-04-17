import Point from "./point";

export default class Sphere {

    position: Point;
    radius: number;

    constructor(position: Point, radius: number) {
        this.position = position;
        this.radius = radius;
    }
}