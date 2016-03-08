define(function(require) {

    //collisions
    //world
    //world coordinates
    //add uchangable background
    //place field in world

    var canvas = document.getElementById("canvas");
    var screenWidth = 800; //canvas.parentNode.clientWidth;
    var screenHeight = 600; //canvas.parentNode.clientHeight;
    var centerX = screenWidth / 2;
    var centerY = screenHeight / 2;
    var bufferWidth = 3040;
    var bufferHeight = 1920;
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

    var spritesImage = new Image();
    spritesImage.src = 'assets/atlas.png';
    spritesImage.onload = function() {
        field.draw();
        var date = new Date();
        var time = date.getTime();
        animate(time);
    };

    var dx = 0;
    var dy = 0;
    var command1 = false;
    var command2 = false;
    var worldX = 0;
    var worldY = 0;

    var createField = require('./field');
    var field = createField(20, spritesImage, fieldContext);
    var fieldData = require('./fielddata');
    field.load(fieldData);

    var createCombine = require('./combine');
    var combine1 = createCombine(150, 150, 71, 80, 3000, 300, spritesImage, bufferContext);
    var combine2 = createCombine(150, 300, 71, 80, 3000, 300, spritesImage, bufferContext);
    var activeMachine = combine1;

    var createTrailer = require('./trailer');
    var trailer = createTrailer(150, 450, 58, 24, 9000, spritesImage, bufferContext);

    var createBar = require('./bar');
    var grainBar = createBar(10, 10, combine1.maxGrain, 80, false, context, "grain");
    var trailerBar = createBar(40, 10, trailer.maxGrain, 80, false, context, "trailer");
    var fuelBar = createBar(70, 10, combine1.maxFuel, 20, true, context, "fuel");

    document.onkeydown = function(e) {
        var key = e.keyCode;
        if (key == 37) dx = -1;
        else if (key == 38) dy = -1;
        else if (key == 39) dx = 1;
        else if (key == 40) dy = 1;
        else if (key == 49) command1 = true;
        //        else if (key == 50) command2 = true;
        else return true;
        return false;
    };

    document.onkeyup = function(e) {
        var key = e.keyCode;
        if (key == 37 || key == 39) dx = 0;
        else if (key == 38 || key == 40) dy = 0;
        else if (key == 49) command1 = false;
        else if (key == 50) command2 = !command2;
        else return true;
        return false;
    };

    function animate(lastTime) {

        // update
        var time = Date.now();
        var timeDiff = time - lastTime;

        if (command2 && activeMachine !== combine2) {
            console.log("switching machine to 2, x: " + activeMachine.x + " y: " + activeMachine.y);
            activeMachine = combine2;
        } else if (!command2 && activeMachine !== combine1) {
            console.log("switching machine to 1, x: " + activeMachine.x + " y: " + activeMachine.y);
            activeMachine = combine1;
        }

        if (dy < 0) {
            field.updateFromCombine(activeMachine, fieldContext, spritesImage);
        }

        activeMachine.update(timeDiff, dx, dy, command1);
        activeMachine.updateTrailer(timeDiff, trailer);

        var trailerDx = combine1.back.x1 - trailer.x,
            trailerDy = combine1.back.y1 - trailer.y;
        trailer.angle = Math.atan2(trailerDy, trailerDx);
        var trailerW = trailer.getPin().x - trailer.x,
            trailerH = trailer.getPin().y - trailer.y;
        trailer.x = combine1.back.x1 - trailerW;
        trailer.y = combine1.back.y1 - trailerH;

        grainBar.update(activeMachine.grain);
        trailerBar.update(trailer.grain);
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
        trailer.draw();

        // bufferContext.fillText(Math.floor((fieldPartsCount-fieldPartsLeft)/fieldPartsCount * 100) + "% done", 80, 20);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(fieldCanvas, worldX, worldY);
        context.drawImage(bufferCanvas, worldX, worldY);

        grainBar.draw();
        trailerBar.draw();
        fuelBar.draw();

        lastTime = time;
        requestAnimFrame(function() {
            animate(lastTime);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
