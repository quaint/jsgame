define({
	renderField: function (ctx, field, spritesImage) {
    for (var i = 0; i < field.width; i++) {
      for (var j = 0; j < field.height; j++) {
        var partOfField = field.parts[i][j];
        if (partOfField.type === 0) {
          ctx.drawImage(spritesImage, 0, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
        } else if (partOfField.type === 3) {
          ctx.drawImage(spritesImage, 60, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
        } else if (partOfField.type === 4) {
          ctx.drawImage(spritesImage, 80, 60, field.grid, field.grid, i * field.grid, j * field.grid, field.grid, field.grid);
        }
      }
    }
  },
  
  renderBar: function (ctx, level, x, y, warningLevel, below) {
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, 20, 100);
    if (below && level < warningLevel) {
      ctx.fillStyle = "#ff0000";
    } else if (!below && level > warningLevel) {
      ctx.fillStyle = "#ff0000";
    } else {
      ctx.fillStyle = "#68c1e7";
    }
    ctx.fillRect(x, 100 + y - level, 20, level);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(x, y, 20, 100);
    ctx.restore();
  },
  
  renderCombine: function (ctx, combineObj, spritesImage, workingTime) {
    ctx.save();
    ctx.translate(combineObj.x, combineObj.y);
    ctx.rotate(combineObj.angle * Math.PI / 180);
    if (workingTime > 0) {
      ctx.drawImage(spritesImage, animationFrame * 20, 80, 20, 20, -combineObj.width + 20, -combineObj.height / 2 + 31, 20, 20);
    }
    ctx.drawImage(spritesImage, 0, 100, combineObj.width, combineObj.height, -combineObj.width + 30, -combineObj.height / 2, combineObj.width, combineObj.height);
    ctx.restore();
  },
  
  renderTrailer: function (ctx, trailerObj, spritesImage) {
    ctx.save();
    ctx.translate(trailerObj.x, trailerObj.y);
    ctx.rotate(trailerObj.angle * Math.PI / 180);
    if (trailerObj.grain > 0) {
      ctx.drawImage(spritesImage, 20, 20, 20, 20, -trailerObj.width, -trailerObj.height / 2, trailerObj.width, trailerObj.height);
    } else {
      ctx.drawImage(spritesImage, 0, 20, 20, 20, -trailerObj.width, -trailerObj.height / 2, trailerObj.width, trailerObj.height);
    }
    ctx.restore();
  }
});