define(['./vehicle'], function(createVehicle) {
    return function(x, y, width, height, maxGrain, sprite, ctx) {
        var trailer = createVehicle(x, y, width, height, sprite, ctx);
        trailer.grain = 0;
        trailer.maxGrain = maxGrain;

        trailer.draw = function() {
            trailer.ctx.save();
            trailer.ctx.translate(trailer.x, trailer.y);
            trailer.ctx.rotate(trailer.angle * Math.PI / 180);
            if (trailer.grain > 0) {
                trailer.ctx.drawImage(trailer.sprite, 20, 20, 20, 20, -trailer.width, -trailer.height / 2, trailer.width, trailer.height);
            } else {
                trailer.ctx.drawImage(trailer.sprite, 0, 20, 20, 20, -trailer.width, -trailer.height / 2, trailer.width, trailer.height);
            }
            trailer.ctx.restore();
        };

        return trailer;
    };
});
