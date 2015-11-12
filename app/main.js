define(function (require) {

  var dx = 0;
  var dy = 0;

  var linearSpeed = 50;
  var animationFrame = 0;
  var acDelta = 0;
  var msPerFrame = 100;
  var workingTime = 0;

  var createField = require('./field');
  var field = createField(10);
  var fieldData = require('./fielddata');
  var createCombine = require('./combine');
  var combine = createCombine(50, 300, 71, 80, 3000, 300);
  var createTrailer = require('./trailer');
  var trailer = createTrailer(500, 500, 20, 20, 9000);
  var renderer = require('./renderer');

  combine.diagonal = combine.height / 2;
  combine.diagonal2 = Math.sqrt(Math.pow(combine.height / 10, 2) + Math.pow(combine.width - 30, 2));
  combine.diagonal2AngleRad = Math.atan2(combine.height / 10, combine.width - 30);
  combine.diagonal2AngleDeg = combine.diagonal2AngleRad * 180 / Math.PI;

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
  spritesImage.onload = function () {
    generateField();
    renderer.renderField(fieldContext, field, spritesImage);
    var date = new Date();
    var time = date.getTime();
    animate(time);
  }

  document.onkeydown = function (e) {
    var key = e.keyCode;
    if (key == 37) dx = -1;
    else if (key == 38) dy = -1;
    else if (key == 39) dx = 1;
    else if (key == 40) dy = 1;
    else if (key == 49) combine.pouring = true;
    else return true;
    return false;
  };

  document.onkeyup = function (e) {
    var key = e.keyCode;
    if (key == 37 || key == 39) dx = 0;
    else if (key == 38 || key == 40) dy = 0;
    else if (key == 49) combine.pouring = false;
    else return true;
    return false;
  };

  function generateField() {
    field.width = fieldData[0].length;
    field.height = fieldData.length
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
  
  function updateFieldView(ctx, i, j, type) {
    if (field.parts[i] === undefined || field.parts[i][j] === undefined) {
      return false;
    }
    var partOfField = field.parts[i][j];
    if (partOfField.type === 0 && type === 1) {
      partOfField.type = type;
      if (combine.grain < combine.maxGrain) {
        combine.grain += 1;
      }
      // fieldPartsLeft--;
      // socket.emit('empty', {i:i, j:j});
      ctx.drawImage(spritesImage, 20, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
      workingTime = 1000;
      return true;
    } else if (partOfField.type === 1 && type === 2) {
      partOfField.type = type;
      // socket.emit('straw', {i:i, j:j});
      ctx.drawImage(spritesImage, 40, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
      return false;
    }
  }

  function animate(lastTime) {

    // update
    var time = Date.now();
    var timeDiff = time - lastTime;
    var linearDistEachFrame = linearSpeed * timeDiff / 1000;

    if (combine.pouring) {
      var distance = calculateDistance(combine, trailer);
      if (combine.grain > 0 && distance < 80) {
        combine.grain -= timeDiff / 10;
        if (trailer.grain < trailer.maxGrain) {
          trailer.grain += timeDiff / 10;
        }
      }
    }

    if (workingTime > 0) {
      workingTime -= timeDiff;
    }

    if (acDelta > msPerFrame) {
      acDelta = 0;
      animationFrame++;
      if (animationFrame > 1) {
        animationFrame = 0;
      }
    } else {
      acDelta += timeDiff;
    }

    if (dy !== 0 || combine.pouring) {
      if (combine.fuel > 0) {
        combine.fuel -= timeDiff * 0.001;
      } else {
        combine.fuel = 0;
      }
      if (dy == 1) {
        combine.angle += linearDistEachFrame * -dx;
      } else {
        combine.angle += linearDistEachFrame * dx;
      }
    }

    combine.x -= dy * Math.cos(combine.angle * Math.PI / 180) * linearDistEachFrame;
    combine.y -= dy * Math.sin(combine.angle * Math.PI / 180) * linearDistEachFrame;

    var diagonalAngle1 = combine.angle + 60;//combine.diagonalAngleDeg;
    var diagonalAngle2 = combine.angle - 60;//combine.diagonalAngleDeg;
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

    // socket.emit('combine', {id:combine.id, x:combine.x, y:combine.y, angle:combine.angle});

    bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    renderer.renderCombine(bufferContext, combine, spritesImage, workingTime, animationFrame);
    renderer.renderTrailer(bufferContext, trailer, spritesImage);

    if (dy < 0) {
      if (bline(combine.header.x1, combine.header.y1, combine.header.x2, combine.header.y2, 1)) {
        bline(combine.back.x1, combine.back.y1, combine.back.x2, combine.back.y2, 2);
      }
    }

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
    requestAnimFrame(function () {
      animate(lastTime);
    });
  }

  function bline(x0, y0, x1, y1, type) {
    x0 = Math.floor(x0 / field.grid);
    y0 = Math.floor(y0 / field.grid);
    x1 = Math.floor(x1 / field.grid);
    y1 = Math.floor(y1 / field.grid);
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = (dx > dy ? dx : -dy) / 2;
    var notEmptyField = false;
    while (true) {
      if (updateFieldView(fieldContext, x0, y0, type)) {
        notEmptyField = true;
      }
      if (x0 === x1 && y0 === y1) break;
      var e2 = err;
      if (e2 > -dx) { err -= dy; x0 += sx; }
      if (e2 < dy) { err += dx; y0 += sy; }
    }
    return notEmptyField;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function calculateDistance(firstObject, secondObject) {
    return Math.sqrt(Math.pow(firstObject.x - secondObject.x, 2) + Math.pow(firstObject.y - secondObject.y, 2));
  }
});