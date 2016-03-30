define(function () {
    return {
        normalizeAngle: function (delta) {
            if (delta > Math.PI) {
                delta -= 2 * Math.PI;
            }
            if (delta < -Math.PI) {
                delta += 2 * Math.PI;
            }
            if (delta > Math.PI || delta < -Math.PI) {
                return this.normalizeAngle(delta);
            } else {
                return delta;
            }
        },
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        drag: function (connectObject, connectTo) {
            var objectDx = connectTo.x - connectObject.x,
                objectDy = connectTo.y - connectObject.y,
                angle = Math.atan2(objectDy, objectDx),
                maxAngle = 30 * (Math.PI / 180.0);
            var delta = connectObject.angle - connectTo.angle;
            delta = this.normalizeAngle(delta);
            if (delta <= maxAngle && delta >= -maxAngle) {
                connectObject.angle = angle;
            } else if (delta > maxAngle) {
                connectObject.angle = angle - delta + maxAngle;
            } else if (delta < -maxAngle) {
                connectObject.angle = angle - delta - maxAngle;
            }
            var objectWidth = connectObject.getPin().x - connectObject.x;
            var objectHeight = connectObject.getPin().y - connectObject.y;
            connectObject.x = connectTo.x - objectWidth;
            connectObject.y = connectTo.y - objectHeight;
        }
    };
});
