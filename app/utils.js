"use strict";
exports.__esModule = true;
/*
 * @param {Number} delta
 * @returns {Number} delta
 */
var sphere_1 = require("./geometry/sphere");
var point_1 = require("./geometry/point");
function normalizeAngle(delta) {
    if (delta > Math.PI) {
        delta -= 2 * Math.PI;
    }
    if (delta < -Math.PI) {
        delta += 2 * Math.PI;
    }
    if (delta > Math.PI || delta < -Math.PI) {
        return this.normalizeAngle(delta);
    }
    else {
        return delta;
    }
}
exports.normalizeAngle = normalizeAngle;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;
function drag(connectedObject, movingObject, otherObjects) {
    var objectDx = movingObject.position.x - connectedObject.position.x;
    var objectDy = movingObject.position.y - connectedObject.position.y;
    var angle = Math.atan2(objectDy, objectDx);
    var maxAngle = toRadians(connectedObject.maxAngle);
    var angleDelta = connectedObject.angle - movingObject.angle;
    angleDelta = normalizeAngle(angleDelta);
    if (angleDelta <= maxAngle && angleDelta >= -maxAngle) {
        connectedObject.angle = angle;
    }
    else if (angleDelta > maxAngle) {
        connectedObject.angle = angle - angleDelta + maxAngle;
    }
    else if (angleDelta < -maxAngle) {
        connectedObject.angle = angle - angleDelta - maxAngle;
    }
    var objectWidth = connectedObject.getFrontPin().x - connectedObject.position.x;
    var objectHeight = connectedObject.getFrontPin().y - connectedObject.position.y;
    var newX = movingObject.position.x - objectWidth;
    var newY = movingObject.position.y - objectHeight;
    var collision = false;
    for (var i = 0; i < otherObjects.length; i++) {
        var point = new point_1["default"](newX + Math.cos(connectedObject.angle) * connectedObject.boundingSphereRadius, newY + Math.sin(connectedObject.angle) * connectedObject.boundingSphereRadius);
        var sphere = new sphere_1["default"](point, connectedObject.boundingSphereRadius);
        if (checkCollision(otherObjects[i], sphere)) {
            collision = true;
            break;
        }
    }
    if (!collision) {
        connectedObject.position = new point_1["default"](newX, newY);
    }
    return !collision;
}
exports.drag = drag;
/**
 * Determine if two rectangles overlap.
 * @param {object}  rectA Object with properties: x, y, width, height.
 * @param {object}  rectB Object with properties: x, y, width, height.
 * @return {boolean}
 */
function intersects(rectA, rectB) {
    return !(rectA.x + rectA.width < rectB.x ||
        rectB.x + rectB.width < rectA.x ||
        rectA.y + rectA.height < rectB.y ||
        rectB.y + rectB.height < rectA.y);
}
exports.intersects = intersects;
/**
 * Check distance between objects.
 * @param {Sphere} firstSphere to check
 * @param {Sphere} secondSphere to check
 * @returns {boolean} result
 */
function checkCollision(firstSphere, secondSphere) {
    var dx = secondSphere.position.x - firstSphere.position.x;
    var dy = secondSphere.position.y - firstSphere.position.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var minDist = firstSphere.radius + secondSphere.radius;
    return dist < minDist;
}
exports.checkCollision = checkCollision;
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
exports.toRadians = toRadians;
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
exports.toDegrees = toDegrees;
function max(first, second) {
    return first > second ? first : second;
}
exports.max = max;
function distanceBetween(pointOne, pointTwo) {
    var dx = pointOne.x - pointTwo.x;
    var dy = pointOne.y - pointTwo.y;
    return Math.sqrt(dx * dx + dy * dy);
}
exports.distanceBetween = distanceBetween;
function updatePositionAndAngle(object, newObject) {
    object.position = newObject.position;
    object.angle = newObject.angle;
}
//# sourceMappingURL=utils.js.map