"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils;
(function (utils) {
    function normalizeAngle(delta) {
        if (delta > Math.PI) {
            delta -= 2 * Math.PI;
        }
        if (delta < -Math.PI) {
            delta += 2 * Math.PI;
        }
        if (delta > Math.PI || delta < -Math.PI) {
            return normalizeAngle(delta);
        }
        else {
            return delta;
        }
    }
    utils.normalizeAngle = normalizeAngle;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    utils.getRandomInt = getRandomInt;
    function drag(connectedObject, movingObject, otherObjects) {
        var objectDx = movingObject.origin.x - connectedObject.origin.x;
        var objectDy = movingObject.origin.y - connectedObject.origin.y;
        var angle = Math.atan2(objectDy, objectDx);
        var maxAngle = toRadians(connectedObject.maxAngle);
        var delta = connectedObject.angle - movingObject.angle;
        delta = normalizeAngle(delta);
        if (delta <= maxAngle && delta >= -maxAngle) {
            connectedObject.angle = angle;
        }
        else if (delta > maxAngle) {
            connectedObject.angle = angle - delta + maxAngle;
        }
        else if (delta < -maxAngle) {
            connectedObject.angle = angle - delta - maxAngle;
        }
        var objectWidth = connectedObject.getPin().x - connectedObject.origin.x;
        var objectHeight = connectedObject.getPin().y - connectedObject.origin.y;
        var newX = movingObject.origin.x - objectWidth;
        var newY = movingObject.origin.y - objectHeight;
        var collision = false;
        for (var i = 0; i < otherObjects.length; i++) {
            if (checkCollision(otherObjects[i], {
                origin: {
                    x: newX + Math.cos(connectedObject.angle) * connectedObject.radius,
                    y: newY + Math.sin(connectedObject.angle) * connectedObject.radius
                },
                radius: connectedObject.radius
            })) {
                collision = true;
                break;
            }
        }
        if (!collision) {
            connectedObject.origin.x = newX;
            connectedObject.origin.y = newY;
        }
        return !collision;
    }
    utils.drag = drag;
    /**
     * Determine if two rectangles overlap.
     * @param {Rectangle}  rectA Object with properties: x, y, width, height.
     * @param {Rectangle}  rectB Object with properties: x, y, width, height.
     * @return {boolean}
     */
    function intersects(rectA, rectB) {
        return !(rectA.origin.x + rectA.size.width < rectB.origin.x ||
            rectB.origin.x + rectB.size.width < rectA.origin.x ||
            rectA.origin.y + rectA.size.height < rectB.origin.y ||
            rectB.origin.y + rectB.size.height < rectA.origin.y);
    }
    utils.intersects = intersects;
    /**
     * Check distance between objects.
     * @param {Vehicle} firstObject to check
     * @param {Vehicle} secondObject to check
     * @returns {boolean} result
     */
    function checkCollision(firstObject, secondObject) {
        var dx = secondObject.origin.x - firstObject.origin.x;
        var dy = secondObject.origin.y - firstObject.origin.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = firstObject.radius + secondObject.radius;
        return dist < minDist;
    }
    utils.checkCollision = checkCollision;
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    utils.toRadians = toRadians;
    function toDegrees(radians) {
        return radians * 180 / Math.PI;
    }
    utils.toDegrees = toDegrees;
})(utils || (utils = {}));
