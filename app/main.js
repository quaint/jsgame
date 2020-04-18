"use strict";
exports.__esModule = true;
var field_1 = require("./entities/field");
var combine_1 = require("./entities/combine");
var machine_1 = require("./entities/machine");
var trailer_1 = require("./entities/trailer");
var bar_1 = require("./ui/bar");
var tractor_1 = require("./entities/tractor");
var fielddata_1 = require("./fielddata");
var keycode_1 = require("./keycode");
var point_1 = require("./geometry/point");
var size_1 = require("./geometry/size");
var bar_renderer_1 = require("./renderers/bar_renderer");
var atlas_png_1 = require("../assets/atlas.png");
// window.requestAnimFrame = (function (callback) {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         function (callback) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();
//collisions
//world
//world coordinates
//forces
var screenWidth = 800; //canvas.parentNode.clientWidth;
var screenHeight = 600; //canvas.parentNode.clientHeight;
var centerX = screenWidth / 2;
var centerY = screenHeight / 2;
var bufferWidth = 3040;
var bufferHeight = 1920;
var canvas = document.getElementById("canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
var context = canvas.getContext("2d");
var bufferCanvas = document.createElement('canvas');
bufferCanvas.width = bufferWidth;
bufferCanvas.height = bufferHeight;
var bufferContext = bufferCanvas.getContext("2d");
var fieldCanvas = document.createElement('canvas');
fieldCanvas.width = bufferWidth;
fieldCanvas.height = bufferHeight;
var fieldContext = fieldCanvas.getContext("2d");
var rotateDirection = 0;
var moveDirection = 0;
var command1 = false;
var command2 = false;
var worldX = 0;
var worldY = 0;
// let backgroundImage = new Image();
// backgroundImage.src = 'assets/grass.jpg';
// backgroundImage.onload = function () {
//     fieldContext.drawImage(backgroundImage, 0, 0, 3150, 2100, 0, 0, 3150, 2100);
// };
var spritesImage = new Image();
spritesImage.onload = function () {
    field.load(fielddata_1["default"]);
    field.draw();
    var date = new Date();
    var time = date.getTime();
    animate(time);
};
spritesImage.src = atlas_png_1["default"];
var field = new field_1["default"](new point_1["default"](100, 100), 20, spritesImage, fieldContext);
var combine1 = new combine_1["default"](new point_1["default"](150, 150), new size_1["default"](71, 80), new point_1["default"](0.58, 0.5), 3000, 300, spritesImage, bufferContext);
var combine2 = new combine_1["default"](new point_1["default"](150, 300), new size_1["default"](71, 80), new point_1["default"](0.58, 0.5), 3000, 300, spritesImage, bufferContext);
var tractor1 = new tractor_1["default"](new point_1["default"](220, 450), new size_1["default"](31, 20), new point_1["default"](0.0, 0.5), 200, spritesImage, bufferContext);
var trailer1 = new trailer_1["default"](new point_1["default"](160, 450), new size_1["default"](56, 24), new point_1["default"](0.0, 0.5), 9000, spritesImage, bufferContext);
var trailer2 = new trailer_1["default"](new point_1["default"](100, 450), new size_1["default"](56, 24), new point_1["default"](0.0, 0.5), 9000, spritesImage, bufferContext);
tractor1.connectedObject = trailer1;
trailer1.connectedObject = trailer2;
var tractor2 = new tractor_1["default"](new point_1["default"](220, 550), new size_1["default"](31, 20), new point_1["default"](0.0, 0.5), 200, spritesImage, bufferContext);
var machine1 = new machine_1["default"](new point_1["default"](150, 550), new size_1["default"](16, 40), new point_1["default"](0.0, 0.5), spritesImage, bufferContext);
tractor2.connectedObject = machine1;
var activeMachine = combine1;
var grainBar = new bar_1["default"](new point_1["default"](10, 10), 0.8, false, "grain");
var trailerBar = new bar_1["default"](new point_1["default"](40, 10), 0.8, false, "trailer");
var fuelBar = new bar_1["default"](new point_1["default"](70, 10), 0.2, true, "fuel");
var barRenderer = new bar_renderer_1["default"](bufferContext);
document.onkeydown = function (event) {
    switch (event.keyCode) {
        case keycode_1["default"].LEFT:
            rotateDirection = -1;
            break;
        case keycode_1["default"].UP:
            moveDirection = -1;
            break;
        case keycode_1["default"].RIGHT:
            rotateDirection = 1;
            break;
        case keycode_1["default"].DOWN:
            moveDirection = 1;
            break;
        case keycode_1["default"].NUMBER_1:
            command1 = true;
            break;
        // case keyCode.NUMBER_2:
        //     command2 = true;
        //     break;
        default:
            return false;
    }
    return false;
};
document.onkeyup = function (event) {
    switch (event.keyCode) {
        case keycode_1["default"].LEFT:
        case keycode_1["default"].RIGHT:
            rotateDirection = 0;
            break;
        case keycode_1["default"].UP:
        case keycode_1["default"].DOWN:
            moveDirection = 0;
            break;
        case keycode_1["default"].NUMBER_1:
            command1 = false;
            break;
        case keycode_1["default"].NUMBER_2:
            command2 = !command2;
            break;
        default:
            return false;
    }
    return false;
};
function animate(lastTime) {
    // update
    var time = Date.now();
    var timeDiff = time - lastTime;
    if (command2 && activeMachine === combine1) {
        console.log("switching machine to 2, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = combine2;
        command2 = false;
    }
    else if (command2 && activeMachine === combine2) {
        console.log("switching machine to 3, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = tractor1;
        command2 = false;
    }
    else if (command2 && activeMachine === tractor1) {
        console.log("switching machine to 4, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = tractor2;
        command2 = false;
    }
    else if (command2 && activeMachine === tractor2) {
        console.log("switching machine to 1, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = combine1;
        command2 = false;
    }
    combine1.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === combine1, [combine2, tractor1, tractor2, trailer1, trailer2, machine1]);
    combine2.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === combine2, [combine1, tractor1, tractor2, trailer1, trailer2, machine1]);
    tractor1.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === tractor1, [combine1, combine2, tractor2, machine1]);
    tractor2.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === tractor2, [combine1, combine2, tractor1, trailer1, trailer2]);
    machine1.updateBack();
    if (activeMachine instanceof combine_1["default"]) {
        activeMachine.updateTrailer(timeDiff, trailer1);
        if (moveDirection < 0) {
            field.updateFromCombine(activeMachine, fieldContext, spritesImage);
        }
    }
    if (activeMachine === tractor2) {
        if (moveDirection < 0) {
            field.updateFromMachine(activeMachine.connectedObject, fieldContext, spritesImage);
        }
    }
    grainBar.updateLevel(activeMachine.grain / activeMachine.maxGrain);
    trailerBar.updateLevel(trailer1.grain / trailer1.maxGrain);
    fuelBar.updateLevel(activeMachine.fuel / activeMachine.maxFuel);
    if (activeMachine.position.x > centerX && activeMachine.position.x < field.widthInPx - centerX) {
        worldX = -activeMachine.position.x + centerX;
    }
    else if (activeMachine.position.x <= centerX) {
        worldX = 0;
    }
    else if (activeMachine.position.x > field.widthInPx - centerX) {
        worldX = -field.widthInPx + centerX * 2;
    }
    if (activeMachine.position.y > centerY && activeMachine.position.y < field.heightInPx - centerY) {
        worldY = -activeMachine.position.y + centerY;
    }
    else if (activeMachine.position.y <= centerY) {
        worldY = 0;
    }
    else if (activeMachine.position.y > field.heightInPx - centerY) {
        worldY = -field.heightInPx + centerY * 2;
    }
    bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    combine1.draw();
    combine2.draw();
    tractor1.draw();
    tractor2.draw();
    trailer1.draw();
    trailer2.draw();
    machine1.draw();
    barRenderer.render(grainBar);
    barRenderer.render(trailerBar);
    barRenderer.render(fuelBar);
    // bufferContext.fillText(Math.floor((fieldPartsCount-fieldPartsLeft)/fieldPartsCount * 100) + "% done", 80, 20);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(fieldCanvas, worldX, worldY);
    context.drawImage(bufferCanvas, worldX, worldY);
    lastTime = time;
    window.requestAnimationFrame(function () {
        animate(lastTime);
    });
}
//# sourceMappingURL=main.js.map