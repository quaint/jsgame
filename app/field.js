import Size from "./size";

export default class Field {
    constructor(position, grid, sprite, ctx) {
        this.position = position;
        this.grid = grid;
        this.size = new Size(0, 0);
        this.widthInPx = 0;
        this.heightInPx = 0;
        this.parts = [];
        this.ctx = ctx;
        this.sprite = sprite;
        this.typePlant = 0;
        this.typeStubble = 1;
        this.typeStraw = 2;
        this.typeWater = 3;
        this.typeGrass = 4;
        this.typeGround = 5;
    };

    updateFromCombine(combine, ctx, spritesImage) {
        let headerPoints = this.getArrayOfPointsForLine(combine.header);
        for (let i = 0; i < headerPoints.length; i++) {
            this.update(combine, headerPoints[i], this.typeStubble, ctx, spritesImage);
        }

        if (combine.isProcessing()) {
            let backPoints = this.getArrayOfPointsForLine(combine.back);
            for (let j = 0; j < backPoints.length; j++) {
                this.update(combine, backPoints[j], this.typeStraw, ctx, spritesImage);
            }
        }
    };

    updateFromMachine(machine, ctx, spritesImage) {
        let backPoints = this.getArrayOfPointsForLine(machine.back);
        for (let j = 0; j < backPoints.length; j++) {
            this.update(machine, backPoints[j], this.typeGround, ctx, spritesImage);
        }
    };

    load(fieldData) {
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

    draw() {
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

    getArrayOfPointsForLine(line) {
        let x0 = Math.floor((line.x1 - this.position.x) / this.grid);
        let y0 = Math.floor((line.y1 - this.position.y) / this.grid);
        let x1 = Math.floor((line.x2 - this.position.x) / this.grid);
        let y1 = Math.floor((line.y2 - this.position.y) / this.grid);
        let dx = Math.abs(x1 - x0);
        let sx = x0 < x1 ? 1 : -1;
        let dy = Math.abs(y1 - y0);
        let sy = y0 < y1 ? 1 : -1;
        let err = (dx > dy ? dx : -dy) / 2;
        let points = [];
        while (true) {
            points.push({
                x: x0,
                y: y0
            });
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

    update(combine, point, type) {
        if (this.parts[point.x] === undefined || this.parts[point.x][point.y] === undefined) {
            return;
        }
        let partOfField = this.parts[point.x][point.y];
        if (partOfField.type === this.typePlant && type === this.typeStubble) {
            partOfField.type = type;
            if (combine.notifyShouldProcess) {
                combine.notifyShouldProcess();
            }
            this.drawPart(point, type);
        } else if ((partOfField.type === this.typeStubble && type === this.typeStraw) ||
            type === this.typeGround) {
            partOfField.type = type;
            this.drawPart(point, type);
        }
    }

    drawPart(point, type) {
        switch (type) {
            case this.typePlant:
                this.drawFieldPartAt(point, 0);
                break;
            case this.typeStubble:
                this.drawFieldPartAt(point, 20);
                break;
            case this.typeStraw:
                this.drawFieldPartAt(point, 40);
                break;
            case this.typeWater:
                this.drawFieldPartAt(point, 60);
                break;
            case this.typeGrass:
                this.drawFieldPartAt(point, 80);
                break;
            case this.typeGround:
                this.drawFieldPartAt(point, 100);
                break;
        }
    }

    drawFieldPartAt(point, x) {
        this.ctx.drawImage(this.sprite, x, 60, this.grid, this.grid, point.x * this.grid + this.position.x, point.y * this.grid + this.position.y, this.grid, this.grid);
    }
}
