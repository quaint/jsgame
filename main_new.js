window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  }
})();

var dx = 0;
var dy = 0;

var screenWidth = 1600;
var screenHeight = 900;

var linearSpeed = 50;

var field = {
  grid: 10, width: 160, height: 90, parts: []
};

var id = getRandomInt(1000, 9999);
var connectedCombines = {};

var combine = {
  id: id,
  x: 100, y: 100, angle: 0, width: 80, height: 80,
  header: { x1: 0, y1: 0, x2: 10, y2: 10},
  back: { x1: 0, y1: 0, x2: 10, y2: 10},
  diagonal: 0,
  diagonalAngleRad: 0,
  diagonalAngleDeg: 0,
  diagonal2: 0,
  diagonal2AngleRad: 0,
  diagonal2AngleDeg: 0,
  sprite: null
};

combine.diagonal = combine.height / 2;
combine.diagonal2 = Math.sqrt(Math.pow(combine.height / 10, 2) + Math.pow(combine.width - 30, 2));
combine.diagonal2AngleRad = Math.atan2(combine.height / 10, combine.width - 30);
combine.diagonal2AngleDeg = combine.diagonal2AngleRad * 180 / Math.PI;

var canvas = document.getElementById("canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
var context = canvas.getContext("2d");

var bufferCanvas = document.createElement('canvas');
bufferCanvas.width = screenWidth;
bufferCanvas.height = screenHeight;
var bufferContext = bufferCanvas.getContext("2d");

var serverCanvas = document.createElement('canvas');
serverCanvas.width = screenWidth;
serverCanvas.height = screenHeight;
var serverContext = serverCanvas.getContext("2d");

var fieldCanvas = document.createElement('canvas');
fieldCanvas.width = screenWidth;
fieldCanvas.height = screenHeight;
var fieldContext = fieldCanvas.getContext("2d");

var spritesImage = new Image();
spritesImage.src = 'atlas.png';
spritesImage.onload = function() {
  generateField();
  renderField(fieldContext);
  var date = new Date();
  var time = date.getTime();
  animate(time);
}

/*
var socket = io();
socket.on('combine', function(combineMsg){
  connectedCombines[combineMsg.id] = combineMsg;
});

socket.on('empty', function(msg){
  fieldContext.drawImage(spritesImage, 20, 60, 20, 20, msg.i * field.grid, msg.j * field.grid, field.grid, field.grid);
});

socket.on('straw', function(msg){
  fieldContext.drawImage(spritesImage, 40, 60, 20, 20, msg.i * field.grid, msg.j * field.grid, field.grid, field.grid);
});
*/

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

function generateField() {
  for (var i = 0; i < field.width; i++) {
    if (!field.parts[i]) {
      field.parts[i] = [];
    }
    for (var j = 0; j < field.height; j++) {
      field.parts[i][j] = {
        type: 0
      };
    }
  }
}

function renderField(ctx) {
  for (var i = 0; i < field.width; i++) {
    for (var j = 0; j < field.height; j++) {
      var partOfField = field.parts[i][j];
      ctx.drawImage(spritesImage, 0, 60, 20, 20, i * field.grid, j * field.grid, field.grid, field.grid);
    }
  }
}

function updateFieldView(ctx, i, j, type) {
  if (type === 1) {
    // socket.emit('empty', {i:i, j:j});
    ctx.drawImage(spritesImage, 20, 60, 20, 20, i * field.grid, j * field.grid, field.grid, field.grid);
  } else if (type === 2) {
    // socket.emit('straw', {i:i, j:j});
    ctx.drawImage(spritesImage, 40, 60, 20, 20, i * field.grid, j * field.grid, field.grid, field.grid);
  }
}

function animate(lastTime) {

  // update
  var date = new Date();
  var time = date.getTime();
  var timeDiff = time - lastTime;
  var linearDistEachFrame = linearSpeed * timeDiff / 1000;

  if (dy !== 0) {
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
  renderCombine(bufferContext, combine);
  // for (var prop in connectedCombines) {
  //   if (connectedCombines.hasOwnProperty(prop)) {
  //     renderCombine(bufferContext, connectedCombines[prop]);
  //   }
  // }

  if (dy < 0) {
    bline(combine.header.x1, combine.header.y1, combine.header.x2, combine.header.y2, 1);
  }
  bline(combine.back.x1, combine.back.y1, combine.back.x2, combine.back.y2, 2);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(fieldCanvas, 0, 0);
  context.drawImage(bufferCanvas, 0, 0);
  context.drawImage(serverCanvas, 0, 0);

  lastTime = time;
  requestAnimFrame(function () {
    animate(lastTime);
  });
}

function renderCombine(ctx, combineObj) {
  ctx.save();
  ctx.translate(combineObj.x, combineObj.y);
  ctx.rotate(combineObj.angle * Math.PI / 180);
  ctx.translate(-combine.width, -combine.height / 2);
  ctx.translate(30, 0);
  ctx.drawImage(spritesImage, 0, 0, 20, 20, 0, 0, combine.width, combine.height);
  ctx.restore();
}

function bline(x0, y0, x1, y1, type) {
  x0 = Math.floor(x0/field.grid);
  y0 = Math.floor(y0/field.grid);
  x1 = Math.floor(x1/field.grid);
  y1 = Math.floor(y1/field.grid);
  var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  var err = (dx>dy ? dx : -dy)/2;

  while (true) {
    updateFieldView(fieldContext, x0, y0, type);
    if (x0 === x1 && y0 === y1) break;
    var e2 = err;
    if (e2 > -dx) { err -= dy; x0 += sx; }
    if (e2 < dy) { err += dx; y0 += sy; }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
