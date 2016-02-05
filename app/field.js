define(function() {
    return function(grid) {
        var field = {
            grid: grid,
            width: 0,
            height: 0,
            parts: []
        };

        field.update = function(start, end) {
            var x0 = Math.floor(start.x / field.grid);
            var y0 = Math.floor(start.y / field.grid);
            var x1 = Math.floor(end.x / field.grid);
            var y1 = Math.floor(end.y / field.grid);
            var dx = Math.abs(x1 - x0);
            var sx = x0 < x1 ? 1 : -1;
            var dy = Math.abs(y1 - y0);
            var sy = y0 < y1 ? 1 : -1;
            var err = (dx > dy ? dx : -dy) / 2;
            var notEmptyField = false;
            while (true) {
                if (updateFieldView(fieldContext, x0, y0, type)) {
                    notEmptyField = true;
                }
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
            return notEmptyField;
        };

        function updateFieldView(i, j, newType) {
            if (field.parts[i] === undefined || field.parts[i][j] === undefined) {
                return false;
            }
            var partOfField = field.parts[i][j];
            if (partOfField.type === 0 && newType === 1) {
                partOfField.type = newType;
                if (combine.grain < combine.maxGrain) {
                    combine.grain += 1;
                }
                ctx.drawImage(spritesImage, 20, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
                combine.workingTime = 1000;
                return true;
            } else if (partOfField.type === 1 && newType === 2) {
                partOfField.type = newType;
                ctx.drawImage(spritesImage, 40, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
                return false;
            }
        }

        return field;
    };
});
