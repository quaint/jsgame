define(['./vehicle'], function (createVehicle) {
    return function (x, y, width, height, maxGrain, sprite, ctx) {
        var trailer = createVehicle(x, y, width, height, sprite, ctx);
        trailer.grain = 0;
        trailer.maxGrain = maxGrain;

        trailer.draw = function () {
            trailer.ctx.save();
            trailer.ctx.translate(trailer.x, trailer.y);
            trailer.ctx.rotate(trailer.angle); // * Math.PI / 180
            // if (trailer.grain > 0) {
            //     trailer.ctx.drawImage(trailer.sprite, 20, 20, 20, 20, -trailer.width, -trailer.height / 2, trailer.width, trailer.height);
            // } else {
            trailer.ctx.drawImage(trailer.sprite, 0, 180, trailer.width, trailer.height, 0, -trailer.height / 2, trailer.width, trailer.height);
            // }
            trailer.ctx.restore();
            trailer.ctx.beginPath();
            trailer.ctx.arc(trailer.getBoundingSphere().x, trailer.getBoundingSphere().y, trailer.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            trailer.ctx.stroke();
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 10, 10);
            // trailer.ctx.fillRect(trailer.getBoundingSphere().x, trailer.getBoundingSphere().y, 10, 10);
            // trailer.ctx.fillRect(trailer.x, trailer.y, 5, 5);
        };

        trailer.getPin = function () {
            return {
                x: trailer.x + Math.cos(trailer.angle) * trailer.width,
                y: trailer.y + Math.sin(trailer.angle) * trailer.width
            };
        };

        trailer.getBoundingSphere = function () {
            return {
                x: trailer.x + Math.cos(trailer.angle) * trailer.width / 2,
                y: trailer.y + Math.sin(trailer.angle) * trailer.width / 2,
                radius: trailer.width / 2
            }
        };

        return trailer;
    };
});
