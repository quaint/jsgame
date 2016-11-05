define(['./vehicle', './configuration', './utils'], function (createVehicle, configuration, utils) {
    'use strict';
    return function (x, y, width, height, sprite, ctx) {
        var machine = createVehicle(x, y, width, height, sprite, ctx);
        machine.radius = machine.width * 0.3;
        machine.anchorY = 0.5;
        machine.anchorX = 0.0;
        machine.maxAngle = 0;
        machine.workSpeed = 30;
        machine.back = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };

        var backHeight = machine.height-20;
        var centerToBack = machine.width-15;
        machine.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        machine.angleBack = Math.atan2(backHeight, centerToBack);

        machine.updateBack = function () {
            var diagonalAngleBack1 = machine.angle + machine.angleBack - utils.toRadians(180); //flip to back of machine
            var diagonalAngleBack2 = machine.angle - machine.angleBack - utils.toRadians(180); //flip to back of machine
            machine.back.x1 = Math.cos(diagonalAngleBack1) * machine.radiusBack + machine.x;
            machine.back.y1 = Math.sin(diagonalAngleBack1) * machine.radiusBack + machine.y;
            machine.back.x2 = Math.cos(diagonalAngleBack2) * machine.radiusBack + machine.x;
            machine.back.y2 = Math.sin(diagonalAngleBack2) * machine.radiusBack + machine.y;
        }

        machine.draw = function () {
            machine.ctx.save();
            machine.ctx.translate(machine.x, machine.y);
            machine.ctx.rotate(machine.angle); // * Math.PI / 180
            // machine.ctx.strokeRect(machine.anchorX * -machine.width, machine.anchorY * -machine.height, machine.width,
            //     machine.height);
            machine.ctx.drawImage(machine.sprite, 0, 230, machine.width, machine.height,
                machine.anchorX * -machine.width, machine.anchorY * -machine.height, machine.width, machine.height);
            machine.ctx.restore();
            // machine.ctx.beginPath();
            // machine.ctx.moveTo(machine.back.x1, machine.back.y1);
            // machine.ctx.lineTo(machine.back.x2, machine.back.y2);
            // machine.ctx.stroke();
            // machine.ctx.fillRect(machine.getPin().x, machine.getPin().y, 4, 4);
            // machine.ctx.fillRect(machine.x, machine.y, 5, 5);
        };

        machine.getPin = function () {
            return {
                x: machine.x + Math.cos(machine.angle) * machine.width,
                y: machine.y + Math.sin(machine.angle) * machine.width
            };
        };

        return machine;
    };
});
