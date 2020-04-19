"use strict";
exports.__esModule = true;
var size_1 = require("../geometry/size");
var point_1 = require("../geometry/point");
var FieldType;
(function (FieldType) {
    FieldType[FieldType["Plant"] = 0] = "Plant";
    FieldType[FieldType["Stubble"] = 1] = "Stubble";
    FieldType[FieldType["Straw"] = 2] = "Straw";
    FieldType[FieldType["Water"] = 3] = "Water";
    FieldType[FieldType["Grass"] = 4] = "Grass";
    FieldType[FieldType["Ground"] = 5] = "Ground";
})(FieldType = exports.FieldType || (exports.FieldType = {}));
var Field = /** @class */ (function () {
    function Field(position, grid, sprite, ctx) {
        this.position = position;
        this.grid = grid;
        this.size = new size_1["default"](0, 0);
        this.widthInPx = 0;
        this.heightInPx = 0;
        this.parts = [];
        this.ctx = ctx;
        this.sprite = sprite;
    }
    ;
    Field.prototype.updateFromCombine = function (combine) {
        var headerPoints = this.getArrayOfPointsForLine(combine.header);
        for (var i = 0; i < headerPoints.length; i++) {
            this.update(combine, headerPoints[i], FieldType.Stubble);
        }
        if (combine.isProcessing()) {
            var backPoints = this.getArrayOfPointsForLine(combine.back);
            for (var j = 0; j < backPoints.length; j++) {
                this.update(combine, backPoints[j], FieldType.Straw);
            }
        }
    };
    ;
    Field.prototype.updateFromMachine = function (machine) {
        var backPoints = this.getArrayOfPointsForLine(machine.back);
        for (var j = 0; j < backPoints.length; j++) {
            this.update(machine, backPoints[j], FieldType.Ground);
        }
    };
    ;
    Field.prototype.load = function (fieldData) {
        this.size.width = fieldData[0].length;
        this.size.height = fieldData.length;
        this.widthInPx = this.size.width * this.grid;
        this.heightInPx = this.size.height * this.grid;
        for (var i = 0; i < fieldData.length; i++) {
            var rowData = fieldData[i].split('');
            for (var j = 0; j < rowData.length; j++) {
                if (!this.parts[j]) {
                    this.parts[j] = [];
                }
                var type = parseInt(rowData[j]);
                this.parts[j][i] = {
                    type: type
                };
            }
        }
    };
    ;
    Field.prototype.draw = function () {
        for (var i = 0; i < this.size.width; i++) {
            for (var j = 0; j < this.size.height; j++) {
                var partOfField = this.parts[i][j];
                this.drawPart({
                    x: i,
                    y: j
                }, partOfField.type);
            }
        }
    };
    ;
    Field.prototype.getArrayOfPointsForLine = function (line) {
        var x0 = Math.floor((line.start.x - this.position.x) / this.grid);
        var y0 = Math.floor((line.start.y - this.position.y) / this.grid);
        var x1 = Math.floor((line.end.x - this.position.x) / this.grid);
        var y1 = Math.floor((line.end.y - this.position.y) / this.grid);
        var dx = Math.abs(x1 - x0);
        var sx = x0 < x1 ? 1 : -1;
        var dy = Math.abs(y1 - y0);
        var sy = y0 < y1 ? 1 : -1;
        var err = (dx > dy ? dx : -dy) / 2;
        var points = [];
        while (true) {
            points.push(new point_1["default"](x0, y0));
            if (x0 === x1 && y0 === y1) {
                break;
            }
            var e2 = err;
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
    };
    Field.prototype.update = function (combine, point, type) {
        if (this.parts[point.x] === undefined || this.parts[point.x][point.y] === undefined) {
            return;
        }
        var partOfField = this.parts[point.x][point.y];
        if (partOfField.type === FieldType.Plant && type === FieldType.Stubble) {
            partOfField.type = type;
            if (combine.notifyShouldProcess) {
                combine.notifyShouldProcess();
            }
            this.drawPart(point, type);
        }
        else if ((partOfField.type === FieldType.Stubble && type === FieldType.Straw) ||
            type === FieldType.Ground) {
            partOfField.type = type;
            this.drawPart(point, type);
        }
    };
    Field.prototype.drawPart = function (point, type) {
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
    };
    Field.prototype.drawFieldPartAt = function (point, x) {
        this.ctx.drawImage(this.sprite, x, 60, this.grid, this.grid, point.x * this.grid + this.position.x, point.y * this.grid + this.position.y, this.grid, this.grid);
    };
    return Field;
}());
exports["default"] = Field;
//# sourceMappingURL=field.js.map