import Size from "../geometry/size";
import Point from "../geometry/point";
import Combine from "./combine";
import Line from "../geometry/line";

export enum FieldType {Plant, Stubble, Straw, Water, Grass, Ground}

export default class Field {

    private position: Point;
    private readonly grid: number;
    private size: Size;
    widthInPx: number;
    heightInPx: number;
    private readonly parts: any[];
    private ctx: any;
    private readonly sprite: any;

    constructor(position: Point, grid: number, sprite: any, ctx: any) {
        this.position = position;
        this.grid = grid;
        this.size = new Size(0, 0);
        this.widthInPx = 0;
        this.heightInPx = 0;
        this.parts = [];
        this.ctx = ctx;
        this.sprite = sprite;
    };

    updateFromCombine(combine: Combine): void {
        let headerPoints = this.getArrayOfPointsForLine(combine.header);
        for (let i = 0; i < headerPoints.length; i++) {
            this.update(combine, headerPoints[i], FieldType.Stubble);
        }

        if (combine.isProcessing()) {
            let backPoints = this.getArrayOfPointsForLine(combine.back);
            for (let j = 0; j < backPoints.length; j++) {
                this.update(combine, backPoints[j], FieldType.Straw);
            }
        }
    };

    updateFromMachine(machine): void {
        let backPoints = this.getArrayOfPointsForLine(machine.back);
        for (let j = 0; j < backPoints.length; j++) {
            this.update(machine, backPoints[j], FieldType.Ground);
        }
    };

    load(fieldData: Array<string>): void {
        this.size.width = fieldData[0].length;
        this.size.height = fieldData.length;
        this.widthInPx = this.size.width * this.grid;
        this.heightInPx = this.size.height * this.grid;
        for (let i = 0; i < fieldData.length; i++) {
            let rowData = fieldData[i].split('');
            for (let j = 0; j < rowData.length; j++) {
                if (!this.parts[j]) {
                    this.parts[j] = [];
                }
                let type = parseInt(rowData[j]);
                this.parts[j][i] = {
                    type: type
                };
            }
        }
    };

    draw(): void {
        for (let i = 0; i < this.size.width; i++) {
            for (let j = 0; j < this.size.height; j++) {
                let partOfField = this.parts[i][j];
                this.drawPart({
                    x: i,
                    y: j
                }, partOfField.type);
            }
        }
    };

    getArrayOfPointsForLine(line: Line): Array<Point> {
        let x0 = Math.floor((line.start.x - this.position.x) / this.grid);
        let y0 = Math.floor((line.start.y - this.position.y) / this.grid);
        let x1 = Math.floor((line.end.x - this.position.x) / this.grid);
        let y1 = Math.floor((line.end.y - this.position.y) / this.grid);
        let dx = Math.abs(x1 - x0);
        let sx = x0 < x1 ? 1 : -1;
        let dy = Math.abs(y1 - y0);
        let sy = y0 < y1 ? 1 : -1;
        let err = (dx > dy ? dx : -dy) / 2;
        let points = [];
        while (true) {
            points.push(new Point(x0, y0));
            if (x0 === x1 && y0 === y1) {
                break;
            }
            let e2 = err;
            if (e2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dy) {
                err += dx;
                y0 += sy;
            }
        }
        return points;
    }

    update(combine: Combine, point: Point, type: FieldType): void {
        if (this.parts[point.x] === undefined || this.parts[point.x][point.y] === undefined) {
            return;
        }
        let partOfField = this.parts[point.x][point.y];
        if (partOfField.type === FieldType.Plant && type === FieldType.Stubble) {
            partOfField.type = type;
            if (combine.notifyShouldProcess) {
                combine.notifyShouldProcess();
            }
            this.drawPart(point, type);
        } else if ((partOfField.type === FieldType.Stubble && type === FieldType.Straw) ||
            type === FieldType.Ground) {
            partOfField.type = type;
            this.drawPart(point, type);
        }
    }

    drawPart(point: Point, type: FieldType): void {
        switch (type) {
            case FieldType.Plant:
                this.drawFieldPartAt(point, 0);
                break;
            case FieldType.Stubble:
                this.drawFieldPartAt(point, 20);
                break;
            case FieldType.Straw:
                this.drawFieldPartAt(point, 40);
                break;
            case FieldType.Water:
                this.drawFieldPartAt(point, 60);
                break;
            case FieldType.Grass:
                this.drawFieldPartAt(point, 80);
                break;
            case FieldType.Ground:
                this.drawFieldPartAt(point, 100);
                break;
        }
    }

    drawFieldPartAt(point: Point, x): void {
        this.ctx.drawImage(this.sprite, x, 60, this.grid, this.grid,
            point.x * this.grid + this.position.x, point.y * this.grid + this.position.y,
            this.grid, this.grid);
    }
}
