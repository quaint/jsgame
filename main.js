window.onerror = function (m, u, l) {
    alert(m + "\n" + u + ":" + l);
};

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
})();

KeyboardJS.on('left', function() {
    dx = -1;
}, function() {
    dx = 0;
});

KeyboardJS.on('right', function() {
    dx = 1;
}, function() {
    dx = 0;
});

KeyboardJS.on('up', function() {
    dy = -1;
}, function() {
    dy = 0;
});

KeyboardJS.on('down', function() {
    dy = 1;
}, function() {
    dy = 0;
});

var screenWidth = 1000;
var screenHeight = 800;

var dx = 0;
var dy = 0;
var trailPoints = [];

var linearSpeed = 30;

var field = {
    grid: 20, width: 40, height: 30, parts: []
};

var combine = {
    x: 100, y: 100, angle: 0, width: 80, height: 80,
    header: {x1: 0, y1: 0, x2: 10, y2: 10},
    back: {x1: 0, y1: 0, x2: 10, y2: 10},
    diagonal: 0,
    diagonalAngleRad: 0,
    diagonalAngleDeg: 0,
    diagonal2: 0,
    diagonal2AngleRad: 0,
    diagonal2AngleDeg: 0,
    sprite: null
};
combine.diagonal = combine.height / 2;

combine.diagonal2 = Math.sqrt(Math.pow(combine.height / 10, 2) + Math.pow(combine.width, 2));
combine.diagonal2AngleRad = Math.atan2(combine.height / 10, combine.width);
combine.diagonal2AngleDeg = combine.diagonal2AngleRad * 180 / Math.PI;

var canvas = document.getElementById("canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
var context = canvas.getContext("2d");

var bufferCanvas = document.createElement('canvas');
bufferCanvas.width = screenWidth;
bufferCanvas.height = screenHeight;
var bufferContext = bufferCanvas.getContext("2d");

var fieldCanvas = document.createElement('canvas');
fieldCanvas.width = screenWidth;
fieldCanvas.height = screenHeight;
var fieldContext = fieldCanvas.getContext("2d");

var trailCanvas = document.createElement('canvas');
trailCanvas.width = screenWidth;
trailCanvas.height = screenHeight;
var trailContext = trailCanvas.getContext("2d");

combine.diagonal = combine.height / 2;//Math.sqrt(Math.pow(combine.height / 2, 2) + Math.pow(combine.width / 2, 2));
//combine.diagonalAngleRad = Math.atan2(combine.height / 2, combine.width / 2);
//combine.diagonalAngleDeg = combine.diagonalAngleRad * 180 / Math.PI;

var spritesImage = new Image();
spritesImage.src = 'atlas.png';
spritesImage.onload = function() {
    generateField();
    renderField(fieldContext);
    var date = new Date();
    var time = date.getTime();
    animate(time);
}

function animate(lastTime) {

    // update
    var date = new Date();
    var time = date.getTime();
    var timeDiff = time - lastTime;
    var linearDistEachFrame = linearSpeed * timeDiff / 1000;

    //if (dy !== 0) {
        combine.angle += linearDistEachFrame * dx;
    //}

    combine.x -= dy * Math.cos(combine.angle * Math.PI / 180);
    combine.y -= dy * Math.sin(combine.angle * Math.PI / 180);

    // if (dy !== 0) {
    //     renderTrail(trailContext);
    // }

    var diagonalAngle1 = combine.angle + 90;//combine.diagonalAngleDeg;
    var diagonalAngle2 = combine.angle - 90;//combine.diagonalAngleDeg;
    var diagonalAngleRad1 = diagonalAngle1 * Math.PI / 180;
    var diagonalAngleRad2 = diagonalAngle2 * Math.PI / 180;
    combine.header.x1 = Math.cos(diagonalAngleRad1) * combine.diagonal + combine.x;
    combine.header.y1 = Math.sin(diagonalAngleRad1) * combine.diagonal + combine.y;
    combine.header.x2 = Math.cos(diagonalAngleRad2) * combine.diagonal + combine.x;
    combine.header.y2 = Math.sin(diagonalAngleRad2) * combine.diagonal + combine.y;

    var diagonalAngleBack1 = combine.angle + combine.diagonal2AngleDeg - 180;
    var diagonalAngleBack2 = combine.angle - combine.diagonal2AngleDeg - 180;
    var diagonalAngleBackRad1 = diagonalAngleBack1 * Math.PI / 180;
    var diagonalAngleBackRad2 = diagonalAngleBack2 * Math.PI / 180;
    combine.back.x1 = Math.cos(diagonalAngleBackRad1) * combine.diagonal2 + combine.x;
    combine.back.y1 = Math.sin(diagonalAngleBackRad1) * combine.diagonal2 + combine.y;
    combine.back.x2 = Math.cos(diagonalAngleBackRad2) * combine.diagonal2 + combine.x;
    combine.back.y2 = Math.sin(diagonalAngleBackRad2) * combine.diagonal2 + combine.y;

    updateField(fieldContext);

    bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    renderCombine(bufferContext);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(fieldCanvas, 0, 0);
    context.drawImage(trailCanvas, 0, 0);
    context.drawImage(bufferCanvas, 0, 0);

    lastTime = time;
    requestAnimFrame(function () {
        animate(lastTime);
    });
}

function generateField() {
    for (var i = 0; i < field.width; i++) {
        if (!field.parts[i]) {
            field.parts[i] = [];
        }
        for (var j = 0; j < field.height; j++) {
            field.parts[i][j] = {
                empty: false,
                straw: false,
                rect: {
                    x1: field.grid * i,
                    y1: field.grid * j,
                    x2: field.grid * i + field.grid,
                    y2: field.grid * j,
                    x3: field.grid * i,
                    y3: field.grid * j + field.grid,
                    x4: field.grid * i + field.grid,
                    y4: field.grid * j + field.grid
                }
            };
        }
    }
}

function renderTrail(ctx) {
    ctx.save();
    ctx.translate(combine.x, combine.y);
    ctx.rotate(combine.angle * Math.PI / 180);
    ctx.translate(-combine.width - 15, -10);
    ctx.drawImage(spritesImage, 0, 80, 20, 20, 0, 0, 20, 20);
    ctx.restore();
}

function renderField(ctx) {
    for (var i = 0; i < field.width; i++) {
        for (var j = 0; j < field.height; j++) {
            partOfField = field.parts[i][j];
            if (partOfField.straw) {
                ctx.drawImage(spritesImage, 40, 60, 20, 20, partOfField.rect.x1, partOfField.rect.y1, field.grid, field.grid);
            } else if (partOfField.empty) {
                ctx.drawImage(spritesImage, 20, 60, 20, 20, partOfField.rect.x1, partOfField.rect.y1, field.grid, field.grid);
            } else {
                ctx.drawImage(spritesImage, 0, 60, 20, 20, partOfField.rect.x1, partOfField.rect.y1, field.grid, field.grid);
            }

        }
    }
}

function updateField(ctx) {
    for (var i = 0; i < field.width; i++) {
        for (var j = 0; j < field.height; j++) {
            partOfField = field.parts[i][j];
            var distance = Math.sqrt(Math.pow(combine.x - partOfField.rect.x1 + field.grid / 2, 2) + Math.pow(combine.y - partOfField.rect.y1 + field.grid / 2, 2));
            if (!partOfField.empty && dy < 0 && distance < combine.width && intersectWithObject(combine.header, partOfField)) {
                partOfField.empty = true;
                ctx.drawImage(spritesImage, 20, 60, 20, 20, partOfField.rect.x1, partOfField.rect.y1, field.grid, field.grid);
            }
            if (distance < combine.width * 2 && partOfField.empty && intersectWithObject(combine.back, partOfField)) {
                partOfField.straw = true;
                ctx.drawImage(spritesImage, 40, 60, 20, 20, partOfField.rect.x1, partOfField.rect.y1, field.grid, field.grid);
            }
        }
    }
}

function renderCombine(ctx) {
    ctx.save();
    //context.lineWidth = 5;
    ctx.fillStyle = 'rgb(100, 180, 125)';
    //context.beginPath();
    //context.moveTo(header.x1, header.y1);
    //context.lineTo(header.x2, header.y2);
    //context.stroke();
    ctx.translate(combine.x, combine.y);
    ctx.rotate(combine.angle * Math.PI / 180);
    ctx.translate(-combine.width, -combine.height / 2);
    //ctx.fillRect(0, 0, combine.width, combine.height);
    ctx.drawImage(spritesImage, 0, 0, 20, 20, 0, 0, combine.width, combine.height);
    ctx.restore();
}

function intersectWithObject(partOfCombine, partOfField) {
    return linesIntersect(partOfCombine.x1, partOfCombine.y1, partOfCombine.x2, partOfCombine.y2, partOfField.rect.x1, partOfField.rect.y1, partOfField.rect.x2, partOfField.rect.y2) == 2 ||
        linesIntersect(partOfCombine.x1, partOfCombine.y1, partOfCombine.x2, partOfCombine.y2, partOfField.rect.x1, partOfField.rect.y1, partOfField.rect.x3, partOfField.rect.y3) == 2 ||
        linesIntersect(partOfCombine.x1, partOfCombine.y1, partOfCombine.x2, partOfCombine.y2, partOfField.rect.x2, partOfField.rect.y2, partOfField.rect.x4, partOfField.rect.y4) == 2 ||
        linesIntersect(partOfCombine.x1, partOfCombine.y1, partOfCombine.x2, partOfCombine.y2, partOfField.rect.x3, partOfField.rect.y3, partOfField.rect.x4, partOfField.rect.y4) == 2;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sameSign(x, y) {
    return ((x < 0) == (y < 0));
}

function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    var x, y;
    var a1, a2, b1, b2, c1, c2;
    /* Coefficients of line eqns. */
    var r1, r2, r3, r4;
    /* 'Sign' values */
    var denom, offset, num;
    /* Intermediate values */

    /* Compute a1, b1, c1, where line joining points 1 and 2
     * is "a1 x  +  b1 y  +  c1  =  0".
     */

    a1 = y2 - y1;
    b1 = x1 - x2;
    c1 = x2 * y1 - x1 * y2;

    /* Compute r3 and r4.
     */

    r3 = a1 * x3 + b1 * y3 + c1;
    r4 = a1 * x4 + b1 * y4 + c1;

    /* Check signs of r3 and r4.  If both point 3 and point 4 lie on
     * same side of line 1, the line segments do not intersect.
     */

    if (r3 !== 0 &&
        r4 !== 0 &&
        sameSign(r3, r4)) {
        return 0;
    }

    /* Compute a2, b2, c2 */

    a2 = y4 - y3;
    b2 = x3 - x4;
    c2 = x4 * y3 - x3 * y4;

    /* Compute r1 and r2 */

    r1 = a2 * x1 + b2 * y1 + c2;
    r2 = a2 * x2 + b2 * y2 + c2;

    /* Check signs of r1 and r2.  If both point 1 and point 2 lie
     * on same side of second line segment, the line segments do
     * not intersect.
     */

    if (r1 !== 0 &&
        r2 !== 0 &&
        sameSign(r1, r2)) {
        return 0;
    }

    /* Line segments intersect: compute intersection point.
     */

    denom = a1 * b2 - a2 * b1;
    if (denom === 0) {
        return 1;
    }

    return 2;

    offset = denom < 0 ? -denom / 2 : denom / 2;

    /* The denom/2 is to get rounding instead of truncating.  It
     * is added or subtracted to the numerator, depending upon the
     * sign of the numerator.
     */

    num = b1 * c2 - b2 * c1;
    x = ( num < 0 ? num - offset : num + offset ) / denom;

    num = a2 * c1 - a1 * c2;
    y = ( num < 0 ? num - offset : num + offset ) / denom;

    return [x, y];
}
