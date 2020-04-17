export default class Size {

    width: number;
    height: number;
    halfOfWidth: number;
    halfOfHeight: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.halfOfWidth = width / 2;
        this.halfOfHeight = height / 2;
    }
}