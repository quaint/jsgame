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
        drag: function (connectObject, connectTo, otherObjects) {
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

            var newX = connectTo.x - objectWidth;
            var newY = connectTo.y - objectHeight;

            var collision = false;
            for (var i = 0; i < otherObjects.length; i++) {
                if (this.checkCollision(otherObjects[i], {x: newX, y: newY, radius: connectObject.radius})) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                connectObject.x = newX;
                connectObject.y = newY;
            }
            return !collision;
        },
        /**
         * Determine if two rectangles overlap.
         * @param {object}  rectA Object with properties: x, y, width, height.
         * @param {object}  rectB Object with properties: x, y, width, height.
         * @return {boolean}
         */
        intersects: function (rectA, rectB) {
            return !(rectA.x + rectA.width < rectB.x ||
            rectB.x + rectB.width < rectA.x ||
            rectA.y + rectA.height < rectB.y ||
            rectB.y + rectB.height < rectA.y);
        },
        /**
         * Check distance between objects.
         * @param {object} firstObject to check
         * @param {object} secondObject to check
         * @returns {boolean} result
         */
        checkCollision: function (firstObject, secondObject) {
            var dx = secondObject.x - firstObject.x;
            var dy = secondObject.y - firstObject.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var minDist = firstObject.radius + secondObject.radius;
            return dist < minDist;
        },
        toRadians: function (degrees) {
            return degrees * Math.PI / 180;
        },
        toDegrees: function (radians) {
            return radians * 180 / Math.PI;
        }
    };
});
