define(function(require) {

    //collisions
    //world
    //world coordinates
    //world scrolling

    var canvas = document.getElementById("canvas");
    var screenWidth = 800; //canvas.parentNode.clientWidth;
    var screenHeight = 600; //canvas.parentNode.clientHeight;
    var centerX = screenWidth / 2;
    var centerY = screenHeight / 2;
    var bufferWidth = 1610;
    var bufferHeight = 960;
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
    var worldX = 0;
    var worldY = 0;

    var createField = require('./field');
    var field = createField(10, spritesImage, fieldContext);
    var fieldData = require('./fielddata');
    field.load(fieldData);

    var createCombine = require('./combine');
    var combine = createCombine(150, 150, 71, 80, 3000, 300, spritesImage, bufferContext);

    var createTrailer = require('./trailer');
    var trailer = createTrailer(500, 500, 20, 20, 9000, spritesImage, bufferContext);

    var createBar = require('./bar');
    var grainBar = createBar(10, 10, combine.maxGrain, 80, false, context, "grain");
    var trailerBar = createBar(40, 10, trailer.maxGrain, 80, false, context, "trailer");
    var fuelBar = createBar(70, 10, combine.maxFuel, 20, true, context, "fuel");

    document.onkeydown = function(e) {
        var key = e.keyCode;
        if (key == 37) dx = -1;
        else if (key == 38) dy = -1;
        else if (key == 39) dx = 1;
        else if (key == 40) dy = 1;
        else if (key == 49) command1 = true;
        else return true;
        return false;
    };

    document.onkeyup = function(e) {
        var key = e.keyCode;
        if (key == 37 || key == 39) dx = 0;
        else if (key == 38 || key == 40) dy = 0;
        else if (key == 49) command1 = false;
        else return true;
        return false;
    };

    function animate(lastTime) {

        // update
        var time = Date.now();
        var timeDiff = time - lastTime;

        if (dy < 0) {
            field.updateFromCombine(combine, fieldContext, spritesImage);
        }

        combine.update(timeDiff, dx, dy, command1);
        combine.updateTrailer(timeDiff, trailer);

        grainBar.update(combine.grain);
        trailerBar.update(trailer.grain);
        fuelBar.update(combine.fuel);

        if (combine.x > centerX && combine.x < field.widthInPx - centerX) {
            worldX = -combine.x + centerX;
        }
        if (combine.y > centerY && combine.y < field.heightInPx - centerY) {
            worldY = -combine.y + centerY;
        }

        bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

        combine.draw();
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
