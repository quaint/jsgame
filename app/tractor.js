define(['./vehicle'], function(createVehicle) {
    return function(x, y, width, height, sprite, ctx) {
        var tractor = createVehicle(x, y, width, height, sprite, ctx);

        trailer.draw = function() {
            trailer.ctx.save();
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 10, 10);
            trailer.ctx.translate(trailer.x, trailer.y);
            trailer.ctx.rotate(trailer.angle * Math.PI / 180);
            trailer.ctx.drawImage(trailer.sprite, 0, 180, trailer.width, trailer.height, 0, -trailer.height / 2, trailer.width, trailer.height);
            trailer.ctx.restore();
        };

        return trailer;
    };
});
