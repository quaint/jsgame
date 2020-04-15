import Field from "./field";
import Combine from "./combine";
import Machine from "./machine";
import Trailer from "./trailer";
import Bar from "./bar";
import Tractor from "./tractor";
import fieldData from "./fielddata";
import keycode from "./keycode";
import Point from "./point";
import Size from "./size";

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

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

let canvas = document.getElementById("canvas");
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
spritesImage.src = require('../assets/atlas.png');

let field = new Field(new Point(100, 100), 10, spritesImage, fieldContext);

let combine1 = new Combine(new Point(150, 150), new Size(71, 80), 3000, 300, spritesImage, bufferContext);
let combine2 = new Combine(new Point(150, 300), new Size(71, 80), 3000, 300, spritesImage, bufferContext);

let tractor1 = new Tractor(new Point(220, 450), new Size(31, 20), 200, spritesImage, bufferContext);
let trailer1 = new Trailer(new Point(160, 450), new Size(56, 24), 9000, spritesImage, bufferContext);
let trailer2 = new Trailer(new Point(100, 450), new Size(56, 24), 9000, spritesImage, bufferContext);
tractor1.connectedObject = trailer1;
trailer1.connectedObject = trailer2;

let tractor2 = new Tractor(new Point(220, 550), new Size(31, 20), 200, spritesImage, bufferContext);
let machine1 = new Machine(new Point(150, 550), new Size(16, 40), spritesImage, bufferContext);
tractor2.connectedObject = machine1;

let activeMachine = combine1;

let grainBar = new Bar(new Point(10, 10), combine1.maxGrain, 80, false, bufferContext, "grain");
let trailerBar = new Bar(new Point(40, 10), trailer1.maxGrain, 80, false, bufferContext, "trailer");
let fuelBar = new Bar(new Point(70, 10), combine1.maxFuel, 20, true, bufferContext, "fuel");

document.onkeydown = function (event) {
    switch (event.keyCode) {
        case keycode.LEFT:
            rotateDirection = -1;
            break;
        case keycode.UP:
            moveDirection = -1;
            break;
        case keycode.RIGHT:
            rotateDirection = 1;
            break;
        case keycode.DOWN:
            moveDirection = 1;
            break;
        case keycode.NUMBER_1:
            command1 = true;
            break;
        // case keycode.NUMBER_2:
        //     command2 = true;
        //     break;
        default:
            return true;
    }
};

document.onkeyup = function (event) {
    switch (event.keyCode) {
        case keycode.LEFT:
        case keycode.RIGHT:
            rotateDirection = 0;
            break;
        case keycode.UP:
        case keycode.DOWN:
            moveDirection = 0;
            break;
        case keycode.NUMBER_1:
            command1 = false;
            break;
        case keycode.NUMBER_2:
            command2 = !command2;
            break;
        default:
            return true;
    }
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

    grainBar.update(activeMachine.grain);
    trailerBar.update(trailer1.grain);
    fuelBar.update(activeMachine.fuel);

    if (activeMachine.x > centerX && activeMachine.x < field.widthInPx - centerX) {
        worldX = -activeMachine.x + centerX;
    } else if (activeMachine.x <= centerX) {
        worldX = 0;
    } else if (activeMachine.x > field.widthInPx - centerX) {
        worldX = -field.widthInPx + centerX * 2;
    }
    if (activeMachine.y > centerY && activeMachine.y < field.heightInPx - centerY) {
        worldY = -activeMachine.y + centerY;
    } else if (activeMachine.y <= centerY) {
        worldY = 0;
    } else if (activeMachine.y > field.heightInPx - centerY) {
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
    grainBar.draw();
    trailerBar.draw();
    fuelBar.draw();

    // bufferContext.fillText(Math.floor((fieldPartsCount-fieldPartsLeft)/fieldPartsCount * 100) + "% done", 80, 20);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(fieldCanvas, worldX, worldY);
    context.drawImage(bufferCanvas, worldX, worldY);

    lastTime = time;
    requestAnimFrame(function () {
        animate(lastTime);
    })
}
