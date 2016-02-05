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
        parseField();
        renderer.renderField(fieldContext, field, spritesImage);
        var date = new Date();
        var time = date.getTime();
        animate(time);
    };

    var dx = 0;
    var dy = 0;

    var animationFrame = 0;
    var acDelta = 0;
    var msPerFrame = 100;

    var createField = require('./field');
    var field = createField(10);
    var fieldData = require('./fielddata');
    var createCombine = require('./combine');
    var combine = createCombine(50, 300, 71, 80, 3000, 300);
    var createTrailer = require('./trailer');
    var trailer = createTrailer(500, 500, 20, 20, 9000);
    var renderer = require('./renderer');

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

    function parseField() {
        field.width = fieldData[0].length;
        field.height = fieldData.length;
        for (var i = 0; i < fieldData.length; i++) {
            var rowData = fieldData[i].split('');
            for (var j = 0; j < rowData.length; j++) {
                if (!field.parts[j]) {
                    field.parts[j] = [];
                }
                field.parts[j][i] = {
                    type: parseInt(rowData[j])
                };
            }
        }
    }

    function updateFieldView(ctx, i, j, newType) {
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

    function animate(lastTime) {

        // update
        var time = Date.now();
        var timeDiff = time - lastTime;

        if (acDelta > msPerFrame) {
            acDelta = 0;
            animationFrame++;
            if (animationFrame > 1) {
                animationFrame = 0;
            }
        } else {
            acDelta += timeDiff;
        }

        var timeDelta = timeDiff * 0.001;
        combine.update(timeDelta, dx, dy);
        combine.updateTrailer(timeDelta, trailer);

        if (dy < 0) {
            field.updateCombine(combine, fieldContext, spritesImage);
        }

        bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

        renderer.renderCombine(bufferContext, combine, spritesImage, animationFrame);
        renderer.renderTrailer(bufferContext, trailer, spritesImage);

        var grainLevel = combine.grain * 100 / combine.maxGrain;
        var trailerGrainLevel = trailer.grain * 100 / trailer.maxGrain;
        var fuelLevel = combine.fuel * 100 / combine.maxFuel;
        renderer.renderBar(bufferContext, grainLevel, 10, 10, 80, false);
        renderer.renderBar(bufferContext, trailerGrainLevel, 40, 10, 80, false);
        renderer.renderBar(bufferContext, fuelLevel, 70, 10, 20, true);

        // bufferContext.fillText(Math.floor((fieldPartsCount-fieldPartsLeft)/fieldPartsCount * 100) + "% done", 80, 20);
        bufferContext.fillText("grain", 9, 122);
        bufferContext.fillText("trailer", 38, 122);
        bufferContext.fillText("fuel", 72, 122);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(fieldCanvas, 0, 0);
        context.drawImage(bufferCanvas, 0, 0);
        // context.drawImage(serverCanvas, 0, 0);

        lastTime = time;
        requestAnimFrame(function() {
            animate(lastTime);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
