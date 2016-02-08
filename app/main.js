define(function(require) {

    var canvas = document.getElementById("canvas");
    var screenWidth = canvas.parentNode.clientWidth;
    var screenHeight = canvas.parentNode.clientHeight;
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

    var createField = require('./field');
    var field = createField(10, spritesImage, fieldContext);
    var fieldData = require('./fielddata');
    field.load(fieldData);

    var createCombine = require('./combine');
    var combine = createCombine(50, 300, 71, 80, 3000, 300, spritesImage, bufferContext);

    var createTrailer = require('./trailer');
    var trailer = createTrailer(500, 500, 20, 20, 9000, spritesImage, bufferContext);

    var createBar = require('./bar');
    var grainBar = createBar(10, 10, 80, false, bufferContext);
    var trailerBar = createBar(40, 10, 80, false, bufferContext);
    var fuelBar = createBar(70, 10, 20, true, bufferContext);

    document.onkeydown = function(e) {
        var key = e.keyCode;
        if (key == 37) dx = -1;
        else if (key == 38) dy = -1;
        else if (key == 39) dx = 1;
        else if (key == 40) dy = 1;
        else if (key == 49) combine.pouring = true;
        else return true;
        return false;
    };

    document.onkeyup = function(e) {
        var key = e.keyCode;
        if (key == 37 || key == 39) dx = 0;
        else if (key == 38 || key == 40) dy = 0;
        else if (key == 49) combine.pouring = false;
        else return true;
        return false;
    };

    function animate(lastTime) {

        // update
        var time = Date.now();
        var timeDiff = time - lastTime;

        combine.update(timeDiff, dx, dy);
        combine.updateTrailer(timeDiff, trailer);

        if (dy < 0) {
            field.updateFromCombine(combine, fieldContext, spritesImage);
        }
        grainBar.update(combine.grain * 100 / combine.maxGrain);
        trailerBar.update(trailer.grain * 100 / trailer.maxGrain);
        fuelBar.update(combine.fuel * 100 / combine.maxFuel);

        bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

        combine.draw();
        trailer.draw();
        grainBar.draw();
        trailerBar.draw();
        fuelBar.draw();

        // bufferContext.fillText(Math.floor((fieldPartsCount-fieldPartsLeft)/fieldPartsCount * 100) + "% done", 80, 20);
        bufferContext.fillText("grain", 9, 122);
        bufferContext.fillText("trailer", 38, 122);
        bufferContext.fillText("fuel", 72, 122);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(fieldCanvas, 0, 0);
        context.drawImage(bufferCanvas, 0, 0);

        lastTime = time;
        requestAnimFrame(function() {
            animate(lastTime);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
