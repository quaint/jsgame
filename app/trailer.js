define(['./vehicle', './configuration'], function (createVehicle, configuration) {
    'use strict';
    return function (x, y, width, height, maxGrain, sprite, ctx) {
        var trailer = createVehicle(x, y, width, height, sprite, ctx);
        trailer.grain = 0;
        trailer.maxGrain = maxGrain;
        trailer.radius = trailer.width * 0.3;
        trailer.anchorY = 0.5;
        trailer.anchorX = 0.0;
        trailer.maxAngle = 55;

        trailer.draw = function () {
            trailer.ctx.save();
            trailer.ctx.translate(trailer.x, trailer.y);
            trailer.ctx.rotate(trailer.angle); // * Math.PI / 180
            // trailer.ctx.strokeRect(trailer.anchorX * -trailer.width, trailer.anchorY * -trailer.height, trailer.width,
            //     trailer.height);
            // if (trailer.grain > 0) {
            //     trailer.ctx.drawImage(trailer.sprite, 20, 20, 20, 20, -trailer.width, -trailer.height / 2, trailer.width, trailer.height);
            // } else {
            trailer.ctx.drawImage(trailer.sprite, 0, 180, trailer.width, trailer.height,
                trailer.anchorX * -trailer.width, trailer.anchorY * -trailer.height, trailer.width, trailer.height);
            // }
            trailer.ctx.restore();
            if (configuration.debug) {
                trailer.ctx.beginPath();
                trailer.ctx.arc(trailer.getBoundingSphere().x, trailer.getBoundingSphere().y, trailer.getBoundingSphere().radius, 0, 2 * Math.PI, false);
                trailer.ctx.stroke();
            }
            // trailer.ctx.fillStyle = "rgb(0,0,0)";
            // trailer.ctx.fillRect(trailer.getPin().x, trailer.getPin().y, 6, 6);
            // trailer.ctx.fillRect(trailer.getBoundingSphere().x, trailer.getBoundingSphere().y, 10, 10);
            // trailer.ctx.fillStyle = "rgb(200,0,0)";
            // trailer.ctx.fillRect(trailer.x, trailer.y, 4, 4);
        };

        trailer.getPin = function () {
            return {
                x: trailer.x + Math.cos(trailer.angle) * trailer.width,
                y: trailer.y + Math.sin(trailer.angle) * trailer.width
            };
        };

        trailer.getBoundingSphere = function () {
            return {
                x: trailer.x + Math.cos(trailer.angle) * trailer.radius,
                y: trailer.y + Math.sin(trailer.angle) * trailer.radius,
                radius: trailer.radius
            };
        };

        return trailer;
    };
});
