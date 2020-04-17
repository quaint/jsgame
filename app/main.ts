import Field from "./entities/field";
import Combine from "./entities/combine";
import Machine from "./entities/machine";
import Trailer from "./entities/trailer";
import Bar from "./ui/bar";
import Tractor from "./entities/tractor";
import {default as fieldData} from "./fielddata";
import {default as keyCode} from "./keycode";
import Point from "./geometry/point";
import Size from "./geometry/size";
import BarRenderer from "./renderers/bar_renderer";
import Vehicle from "./entities/vehicle";
import atlas from '../assets/atlas.png'

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

let screenWidth = 800; //canvas.parentNode.clientWidth;
let screenHeight = 600; //canvas.parentNode.clientHeight;
let centerX = screenWidth / 2;
let centerY = screenHeight / 2;
let bufferWidth = 3040;
let bufferHeight = 1920;

let canvas = <HTMLCanvasElement> document.getElementById("canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
let context = canvas.getContext("2d");

let bufferCanvas = document.createElement('canvas');
bufferCanvas.width = bufferWidth;
bufferCanvas.height = bufferHeight;
let bufferContext = bufferCanvas.getContext("2d");

let fieldCanvas = document.createElement('canvas');
fieldCanvas.width = bufferWidth;
fieldCanvas.height = bufferHeight;
let fieldContext = fieldCanvas.getContext("2d");

let rotateDirection = 0;
let moveDirection = 0;
let command1 = false;
let command2 = false;
let worldX = 0;
let worldY = 0;

// let backgroundImage = new Image();
// backgroundImage.src = 'assets/grass.jpg';
// backgroundImage.onload = function () {
//     fieldContext.drawImage(backgroundImage, 0, 0, 3150, 2100, 0, 0, 3150, 2100);
// };

let spritesImage = new Image();
spritesImage.onload = function () {
    field.load(fieldData);
    field.draw();
    let date = new Date();
    let time = date.getTime();
    animate(time);
};
spritesImage.src = atlas;

let field = new Field(new Point(100, 100), 20, spritesImage, fieldContext);

let combine1 = new Combine(new Point(150, 150), new Size(71, 80), new Point(0.58, 0.5), 3000, 300, spritesImage, bufferContext);
let combine2 = new Combine(new Point(150, 300), new Size(71, 80), new Point(0.58, 0.5), 3000, 300, spritesImage, bufferContext);

let tractor1 = new Tractor(new Point(220, 450), new Size(31, 20), new Point(0.0, 0.5), 200, spritesImage, bufferContext);
let trailer1 = new Trailer(new Point(160, 450), new Size(56, 24), new Point(0.0, 0.5), 9000, spritesImage, bufferContext);
let trailer2 = new Trailer(new Point(100, 450), new Size(56, 24), new Point(0.0, 0.5), 9000, spritesImage, bufferContext);
tractor1.connectedObject = trailer1;
trailer1.connectedObject = trailer2;

let tractor2 = new Tractor(new Point(220, 550), new Size(31, 20), new Point(0.0, 0.5), 200, spritesImage, bufferContext);
let machine1 = new Machine(new Point(150, 550), new Size(16, 40), new Point(0.0, 0.5), spritesImage, bufferContext);
tractor2.connectedObject = machine1;

let activeMachine: Vehicle = combine1;

let grainBar = new Bar(new Point(10, 10), 0.8, false, "grain");
let trailerBar = new Bar(new Point(40, 10), 0.8, false, "trailer");
let fuelBar = new Bar(new Point(70, 10), 0.2, true, "fuel");
let barRenderer = new BarRenderer(bufferContext);

document.onkeydown = function (event) {
    switch (event.keyCode) {
        case keyCode.LEFT:
            rotateDirection = -1;
            break;
        case keyCode.UP:
            moveDirection = -1;
            break;
        case keyCode.RIGHT:
            rotateDirection = 1;
            break;
        case keyCode.DOWN:
            moveDirection = 1;
            break;
        case keyCode.NUMBER_1:
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
        case keyCode.LEFT:
        case keyCode.RIGHT:
            rotateDirection = 0;
            break;
        case keyCode.UP:
        case keyCode.DOWN:
            moveDirection = 0;
            break;
        case keyCode.NUMBER_1:
            command1 = false;
            break;
        case keyCode.NUMBER_2:
            command2 = !command2;
            break;
        default:
            return false;
    }
    return false;
};

function animate(lastTime) {

    // update
    let time = Date.now();
    let timeDiff = time - lastTime;

    if (command2 && activeMachine === combine1) {
        console.log("switching machine to 2, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = combine2;
        command2 = false;
    } else if (command2 && activeMachine === combine2) {
        console.log("switching machine to 3, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = tractor1;
        command2 = false;
    } else if (command2 && activeMachine === tractor1) {
        console.log("switching machine to 4, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = tractor2;
        command2 = false;
    } else if (command2 && activeMachine === tractor2) {
        console.log("switching machine to 1, x: " + activeMachine.position.x + " y: " + activeMachine.position.y);
        activeMachine = combine1;
        command2 = false;
    }

    combine1.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === combine1,
        [combine2, tractor1, tractor2, trailer1, trailer2, machine1]);
    combine2.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === combine2,
        [combine1, tractor1, tractor2, trailer1, trailer2, machine1]);
    tractor1.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === tractor1,
        [combine1, combine2, tractor2, machine1]);
    tractor2.update(timeDiff, rotateDirection, moveDirection, command1, activeMachine === tractor2,
        [combine1, combine2, tractor1, trailer1, trailer2]);
    machine1.updateBack();

    if (activeMachine !== tractor1 && activeMachine !== tractor2) {
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

    grainBar.update(activeMachine.grain / activeMachine.maxGrain);
    trailerBar.update(trailer1.grain / trailer1.maxGrain);
    fuelBar.update(activeMachine.fuel / activeMachine.maxFuel);

    if (activeMachine.position.x > centerX && activeMachine.position.x < field.widthInPx - centerX) {
        worldX = -activeMachine.position.x + centerX;
    } else if (activeMachine.position.x <= centerX) {
        worldX = 0;
    } else if (activeMachine.position.x > field.widthInPx - centerX) {
        worldX = -field.widthInPx + centerX * 2;
    }
    if (activeMachine.position.y > centerY && activeMachine.position.y < field.heightInPx - centerY) {
        worldY = -activeMachine.position.y + centerY;
    } else if (activeMachine.position.y <= centerY) {
        worldY = 0;
    } else if (activeMachine.position.y > field.heightInPx - centerY) {
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
    })
}
