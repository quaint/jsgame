/*
 * @param {Number} delta
 * @returns {Number} delta
 */
import Sphere from "./geometry/sphere";
import Point from "./geometry/point";

function normalizeAngle(delta) {
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
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * @param {Vehicle} connectedObject
 * @param {Vehicle} movingObject
 * @param {[Vehicle]} otherObjects
 * @returns {boolean} result
 */
function drag(connectedObject, movingObject, otherObjects) {
    let objectDx = movingObject.position.x - connectedObject.position.x;
    let objectDy = movingObject.position.y - connectedObject.position.y;
    let angle = Math.atan2(objectDy, objectDx);
    let maxAngle = toRadians(connectedObject.maxAngle);
    let delta = connectedObject.angle - movingObject.angle;

    delta = normalizeAngle(delta);
    if (delta <= maxAngle && delta >= -maxAngle) {
        connectedObject.angle = angle;
    } else if (delta > maxAngle) {
        connectedObject.angle = angle - delta + maxAngle;
    } else if (delta < -maxAngle) {
        connectedObject.angle = angle - delta - maxAngle;
    }

    let objectWidth = connectedObject.getPin().x - connectedObject.position.x;
    let objectHeight = connectedObject.getPin().y - connectedObject.position.y;

    let newX = movingObject.position.x - objectWidth;
    let newY = movingObject.position.y - objectHeight;

    let collision = false;
    for (let i = 0; i < otherObjects.length; i++) {
        let point = new Point(
            newX + Math.cos(connectedObject.angle) * connectedObject.boundingSphereRadius,
            newY + Math.sin(connectedObject.angle) * connectedObject.boundingSphereRadius);
        let sphere = new Sphere(point, connectedObject.boundingSphereRadius);
        if (checkCollision(otherObjects[i], sphere)) {
            collision = true;
            break;
        }
    }

    if (!collision) {
        connectedObject.position = new Point(newX, newY);
    }
    return !collision;
}

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

/**
 * Check distance between objects.
 * @param {Sphere} firstSphere to check
 * @param {Sphere} secondSphere to check
 * @returns {boolean} result
 */
function checkCollision(firstSphere, secondSphere) {
    let dx = secondSphere.position.x - firstSphere.position.x;
    let dy = secondSphere.position.y - firstSphere.position.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let minDist = firstSphere.radius + secondSphere.radius;
    return dist < minDist;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

function max(first, second) {
    return first > second ? first : second;
}

export {checkCollision, drag, getRandomInt, intersects, normalizeAngle, toDegrees, toRadians, max}
