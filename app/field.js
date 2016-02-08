define(function() {
    return function(grid, sprite, ctx) {
        var field = {
            grid: grid,
            width: 0,
            height: 0,
            parts: [],
            ctx: ctx,
            sprite: sprite
        };

        field.updateFromCombine = function(combine, ctx, spritesImage) {
            var headerPoints = getArrayOfPointsForLine(combine.header);
            for (var i = 0; i < headerPoints.length; i++) {
                update(combine, headerPoints[i], 1, ctx, spritesImage);
            }
            if (combine.isProcessing()) {
                var backPoints = getArrayOfPointsForLine(combine.back);
                for (var i = 0; i < backPoints.length; i++) {
                    update(combine, backPoints[i], 2, ctx, spritesImage);
                }
            }
        };

        field.load = function(fieldData) {
            field.width = fieldData[0].length;
            field.height = fieldData.length;
            for (var i = 0; i < fieldData.length; i++) {
                var rowData = fieldData[i].split('');
                for (var j = 0; j < rowData.length; j++) {
                    if (!field.parts[j]) {
                        field.parts[j] = [];
                    }
                    field.parts[j][i] = {
                        type: parseInt(rowData[j])
                    };
                }
            }
        };

        field.draw = function() {
            for (var i = 0; i < field.width; i++) {
                for (var j = 0; j < field.height; j++) {
                    var partOfField = field.parts[i][j];
                    if (partOfField.type === 0) {
                        field.ctx.drawImage(field.sprite, 0, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
                    } else if (partOfField.type === 3) {
                        field.ctx.drawImage(field.sprite, 60, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
                    } else if (partOfField.type === 4) {
                        field.ctx.drawImage(field.sprite, 80, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
                    }
                }
            }
        };

        function getArrayOfPointsForLine(line) {
            var x0 = Math.floor(line.x1 / field.grid);
            var y0 = Math.floor(line.y1 / field.grid);
            var x1 = Math.floor(line.x2 / field.grid);
            var y1 = Math.floor(line.y2 / field.grid);
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
                return false;
            }
            var partOfField = field.parts[point.x][point.y];
            if (partOfField.type === 0 && type === 1) {
                partOfField.type = type;
                if (combine.grain < combine.maxGrain) {
                    combine.grain += 1;
                }
                field.ctx.drawImage(field.sprite, 20, 60, field.grid, field.grid, point.x * field.grid, point.y * field.grid, field.grid, field.grid);
                combine.workingTime = 1000;
                return true;
            } else if (partOfField.type === 1 && type === 2) {
                partOfField.type = type;
                field.ctx.drawImage(field.sprite, 40, 60, field.grid, field.grid, point.x * field.grid, point.y * field.grid, field.grid, field.grid);
                return false;
            }
        }

        return field;
    };
});
