var assetsToLoader = ["atlas.json"];
loader = new PIXI.AssetLoader(assetsToLoader);
loader.onComplete = onAssetsLoaded;
loader.load();

var screenWidth = 1000;
var screenHeight = 800;

var stage = new PIXI.Stage(0xFFFFFF);
var renderer = new PIXI.autoDetectRenderer(screenWidth, screenHeight);
document.body.appendChild(renderer.view);

var fieldFullTexture;
var fieldEmptyTexture;
var fieldBackTexture;

var dx = 0;
var dy = 0;

var linearSpeed = 30;

var field = {
    grid: 20, width: 70, height: 55, parts: []
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
combine.diagonal2AngleDeg = combine.diagonal2AngleRad * PIXI.RAD_TO_DEG;

document.onkeydown = function (e) {
    var key = e.keyCode;
    if (key == 37) dx = -1;
    else if (key == 38) dy = -1;
    else if (key == 39) dx = 1;
    else if (key == 40) dy = 1;
    else return true;
    return false;
};
document.onkeyup = function (e) {
    var key = e.keyCode;
    if (key == 37 || key == 39) dx = 0;
    else if (key == 38 || key == 40) dy = 0;
    else return true;
    return false;
};

var fieldContainer = new PIXI.SpriteBatch();
stage.addChild(fieldContainer);

function onAssetsLoaded() {

    fieldFullTexture = PIXI.Texture.fromFrame("field1.png");
    fieldEmptyTexture = PIXI.Texture.fromFrame("field2.png");
    fieldBackTexture = PIXI.Texture.fromFrame("field3.png");

    generateField();

    combine.sprite = PIXI.Sprite.fromFrame("combine.png");
    combine.sprite.pivot.x = combine.sprite.width;
    combine.sprite.pivot.y = combine.sprite.height/2;
    combine.sprite.position.x = combine.x;
    combine.sprite.position.y = combine.y;
    combine.sprite.rotation = combine.angle * PIXI.RAD_TO_DEG;
    combine.sprite.scale.x = combine.width / combine.sprite.width;
    combine.sprite.scale.y = combine.height / combine.sprite.height;
    stage.addChild(combine.sprite);

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
    combine.angle += linearDistEachFrame * dx;

    var combineAngleInRad = combine.angle * PIXI.DEG_TO_RAD;
    combine.sprite.rotation = combineAngleInRad;

    combine.x -= dy * Math.cos(combineAngleInRad);
    combine.y -= dy * Math.sin(combineAngleInRad);

    combine.sprite.position.x = combine.x;
    combine.sprite.position.y = combine.y;

    //if (dy !== 0) {
    //    trailPoints.push({x: combine.x, y: combine.y, angle: combine.angle});
    //}

    var diagonalAngle1 = combine.angle + 90;
    var diagonalAngle2 = combine.angle - 90;
    var diagonalAngleRad1 = diagonalAngle1 * PIXI.DEG_TO_RAD;
    var diagonalAngleRad2 = diagonalAngle2 * PIXI.DEG_TO_RAD;
    combine.header.x1 = Math.cos(diagonalAngleRad1) * combine.diagonal + combine.x;
    combine.header.y1 = Math.sin(diagonalAngleRad1) * combine.diagonal + combine.y;
    combine.header.x2 = Math.cos(diagonalAngleRad2) * combine.diagonal + combine.x;
    combine.header.y2 = Math.sin(diagonalAngleRad2) * combine.diagonal + combine.y;

    var diagonalAngleBack1 = combine.angle + combine.diagonal2AngleDeg - 180;
    var diagonalAngleBack2 = combine.angle - combine.diagonal2AngleDeg - 180;
    var diagonalAngleBackRad1 = diagonalAngleBack1 * PIXI.DEG_TO_RAD;
    var diagonalAngleBackRad2 = diagonalAngleBack2 * PIXI.DEG_TO_RAD;
    combine.back.x1 = Math.cos(diagonalAngleBackRad1) * combine.diagonal2 + combine.x;
    combine.back.y1 = Math.sin(diagonalAngleBackRad1) * combine.diagonal2 + combine.y;
    combine.back.x2 = Math.cos(diagonalAngleBackRad2) * combine.diagonal2 + combine.x;
    combine.back.y2 = Math.sin(diagonalAngleBackRad2) * combine.diagonal2 + combine.y;

    //var graphics = new PIXI.Graphics();
    //graphics.lineStyle(2, 0x0000FF, 1);
    //graphics.drawRect(combine.back.x1, combine.back.y1, 5, 5);
    //graphics.drawRect(combine.back.x2, combine.back.y2, 5, 5);
    //stage.addChild(graphics);

    if (dy < 0) {
        for (var i = 0; i < field.width; i++) {
            for (var j = 0; j < field.height; j++) {
                partOfField = field.parts[i][j];
                var distance = Math.sqrt(Math.pow(combine.x - partOfField.rect.x1 + field.grid / 2, 2) + Math.pow(combine.y - partOfField.rect.y1 + field.grid / 2, 2));
                /*
                if (!partOfField.empty && distance < combine.width && intersectWithObject(combine.header, partOfField)) {
                    partOfField.empty = true;
                    partOfField.sprite.setTexture(fieldEmptyTexture);
                }
                */
                if (distance < combine.width * 2 && intersectWithObject(combine.back, partOfField)) {
                    partOfField.sprite.setTexture(fieldBackTexture);
                }
            }
        }
    }

    //renderTexture.render(stage2, null, true);

    renderer.render(stage);

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
                rect: {
                    x1: field.grid * i,
                    y1: field.grid * j,
                    x2: field.grid * i + field.grid,
                    y2: field.grid * j,
                    x3: field.grid * i,
                    y3: field.grid * j + field.grid,
                    x4: field.grid * i + field.grid,
                    y4: field.grid * j + field.grid
                },
                sprite: new PIXI.Sprite(fieldFullTexture)
            };
            field.parts[i][j].sprite.position.x = field.grid * i;
            field.parts[i][j].sprite.position.y = field.grid * j;
            field.parts[i][j].sprite.scale.x = field.grid / field.parts[i][j].sprite.width;
            field.parts[i][j].sprite.scale.y = field.grid / field.parts[i][j].sprite.height;
            fieldContainer.addChild(field.parts[i][j].sprite);
        }
    }
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
