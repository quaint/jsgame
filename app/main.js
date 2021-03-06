define(['./field', './fielddata', './combine', './tractor', './trailer', './bar', './keycode', './utils', './machine'],
    function (createField, fieldData, createCombine, createTractor, createTrailer, createBar, keycode, utils, createMachine) {
        'use strict';

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

        // var backgroundImage = new Image();
        // backgroundImage.src = 'assets/grass.jpg';
        // backgroundImage.onload = function () {
        //     fieldContext.drawImage(backgroundImage, 0, 0, 3150, 2100, 0, 0, 3150, 2100);
        // };

        var spritesImage = new Image();
        spritesImage.src = 'assets/atlas.png';
        spritesImage.onload = function () {
            field.load(fieldData);
            field.draw();
            var date = new Date();
            var time = date.getTime();
            animate(time);
        };

        var field = createField(100, 100, 10, spritesImage, fieldContext);

        var combine1 = createCombine(150, 150, 71, 80, 3000, 300, spritesImage, bufferContext);
        var combine2 = createCombine(150, 300, 71, 80, 3000, 300, spritesImage, bufferContext);

        var tractor1 = createTractor(220, 450, 31, 20, 200, spritesImage, bufferContext);
        var trailer1 = createTrailer(160, 450, 56, 24, 9000, spritesImage, bufferContext);
        var trailer2 = createTrailer(100, 450, 56, 24, 9000, spritesImage, bufferContext);
        tractor1.connectedObject = trailer1;
        trailer1.connectedObject = trailer2;

        var tractor2 = createTractor(220, 550, 31, 20, 200, spritesImage, bufferContext);
        var machine1 = createMachine(150, 550, 16, 40, spritesImage, bufferContext);
        tractor2.connectedObject = machine1;

        var activeMachine = combine1;

        var grainBar = createBar(10, 10, combine1.maxGrain, 80, false, bufferContext, "grain");
        var trailerBar = createBar(40, 10, trailer1.maxGrain, 80, false, bufferContext, "trailer");
        var fuelBar = createBar(70, 10, combine1.maxFuel, 20, true, bufferContext, "fuel");

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
            var time = Date.now();
            var timeDiff = time - lastTime;

            if (command2 && activeMachine === combine1) {
                console.log("switching machine to 2, x: " + activeMachine.x + " y: " + activeMachine.y);
                activeMachine = combine2;
                command2 = false;
            } else if (command2 && activeMachine === combine2) {
                console.log("switching machine to 3, x: " + activeMachine.x + " y: " + activeMachine.y);
                activeMachine = tractor1;
                command2 = false;
            } else if (command2 && activeMachine === tractor1) {
                console.log("switching machine to 4, x: " + activeMachine.x + " y: " + activeMachine.y);
                activeMachine = tractor2;
                command2 = false;
            } else if (command2 && activeMachine === tractor2) {
                console.log("switching machine to 1, x: " + activeMachine.x + " y: " + activeMachine.y);
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
            });
        }
    });
