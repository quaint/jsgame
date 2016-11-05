define(["./configuration"], function (configuration) {
    'use strict';
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

        drag: function (connectedObject, movingObject, otherObjects) {
            var objectDx = movingObject.x - connectedObject.x,
                objectDy = movingObject.y - connectedObject.y,
                angle = Math.atan2(objectDy, objectDx),
                maxAngle = this.toRadians(connectedObject.maxAngle),
                delta = connectedObject.angle - movingObject.angle;

            delta = this.normalizeAngle(delta);
            if (delta <= maxAngle && delta >= -maxAngle) {
                connectedObject.angle = angle;
            } else if (delta > maxAngle) {
                connectedObject.angle = angle - delta + maxAngle;
            } else if (delta < -maxAngle) {
                connectedObject.angle = angle - delta - maxAngle;
            }
            var objectWidth = connectedObject.getPin().x - connectedObject.x;
            var objectHeight = connectedObject.getPin().y - connectedObject.y;

            var newX = movingObject.x - objectWidth;
            var newY = movingObject.y - objectHeight;

            var collision = false;
            for (var i = 0; i < otherObjects.length; i++) {
                if (this.checkCollision(otherObjects[i], {
                        x: newX + Math.cos(connectedObject.angle) * connectedObject.radius,
                        y: newY + Math.sin(connectedObject.angle) * connectedObject.radius,
                        radius: connectedObject.radius
                    })) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                connectedObject.x = newX;
                connectedObject.y = newY;
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
