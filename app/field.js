define(function () {
    'use strict';
    return function (x, y, grid, sprite, ctx) {
        var field = {
            x: x,
            y: y,
            grid: grid,
            width: 0,
            height: 0,
            widthInPx: 0,
            heightInPx: 0,
            parts: [],
            ctx: ctx,
            sprite: sprite,
            typePlant: 0,
            typeStubble: 1,
            typeStraw: 2,
            typeWater: 3,
            typeGrass: 4
        };

        field.updateFromCombine = function (combine, ctx, spritesImage) {
            var headerPoints = getArrayOfPointsForLine(combine.header);
            for (var i = 0; i < headerPoints.length; i++) {
                update(combine, headerPoints[i], field.typeStubble, ctx, spritesImage);
            }

            if (combine.isProcessing()) {
                var backPoints = getArrayOfPointsForLine(combine.back);
                for (var j = 0; j < backPoints.length; j++) {
                    update(combine, backPoints[j], field.typeStraw, ctx, spritesImage);
                }
            }
        };

        field.load = function (fieldData) {
            field.width = fieldData[0].length;
            field.height = fieldData.length;
            field.widthInPx = field.width * field.grid;
            field.heightInPx = field.height * field.grid;
            for (var i = 0; i < fieldData.length; i++) {
                var rowData = fieldData[i].split('');
                for (var j = 0; j < rowData.length; j++) {
                    if (!field.parts[j]) {
                        field.parts[j] = [];
                    }
                    var type = parseInt(rowData[j]);
                    field.parts[j][i] = {
                        type: type
                    };
                }
            }
        };

        field.draw = function () {
            for (var i = 0; i < field.width; i++) {
                for (var j = 0; j < field.height; j++) {
                    var partOfField = field.parts[i][j];
                    drawPart({
                        x: i,
                        y: j
                    }, partOfField.type);
                }
            }
        };

        function getArrayOfPointsForLine(line) {
            var x0 = Math.floor((line.x1 - field.x) / field.grid);
            var y0 = Math.floor((line.y1 - field.y) / field.grid);
            var x1 = Math.floor((line.x2 - field.x) / field.grid);
            var y1 = Math.floor((line.y2 - field.y) / field.grid);
            var dx = Math.abs(x1 - x0);
            var sx = x0 < x1 ? 1 : -1;
            var dy = Math.abs(y1 - y0);
            var sy = y0 < y1 ? 1 : -1;
            var err = (dx > dy ? dx : -dy) / 2;
            var points = [];
            while (true) {
                points.push({
                    x: x0,
                    y: y0
                });
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
        }

        function update(combine, point, type) {
            if (field.parts[point.x] === undefined || field.parts[point.x][point.y] === undefined) {
                return;
            }
            var partOfField = field.parts[point.x][point.y];
            if (partOfField.type === field.typePlant && type === field.typeStubble) {
                partOfField.type = type;
                combine.notifyShouldProcess();
                drawPart(point, type);
            } else if (partOfField.type === field.typeStubble && type === field.typeStraw) {
                partOfField.type = type;
                drawPart(point, type);
            }
        }

        function drawPart(point, type) {
            switch(type) {
                case field.typePlant:
                    drawFieldPartAt(point, 0);
                    break;
                case field.typeStubble:
                    drawFieldPartAt(point, 20);
                    break;
                case field.typeStraw:
                    drawFieldPartAt(point, 40);
                    break;
                case field.typeWater:
                    drawFieldPartAt(point, 60);
                    break;
                case field.typeGrass:
                    drawFieldPartAt(point, 80);
                    break;
            }
       }

       function drawFieldPartAt(point, x) {
           field.ctx.drawImage(field.sprite, x, 60, field.grid, field.grid, point.x * field.grid + field.x, point.y * field.grid + field.y, field.grid, field.grid);
       }

        return field;
    };
});
