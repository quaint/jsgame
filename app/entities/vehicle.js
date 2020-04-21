"use strict";
exports.__esModule = true;
var point_1 = require("../geometry/point");
var sphere_1 = require("../geometry/sphere");
var utils = require("../utils");
var configuration_1 = require("../configuration");
var utils_1 = require("../utils");
var utils_2 = require("../utils");
var Vehicle = /** @class */ (function () {
    function Vehicle(position, size, sprite, ctx) {
        this.position = position;
        this.size = size;
        this.anchor = new point_1["default"](0.5, 0.5);
        this.topLeftOffset = new point_1["default"](-this.size.width * this.anchor.x, -this.size.height * this.anchor.y);
        this.sprite = sprite;
        this.ctx = ctx;
        this.boundingSphereRadius = utils.max(size.width, size.height) * 0.5;
        this.angle = 0;
        this.linearSpeed = 10;
        this.connectedObject = null;
        this.msPerFrame = 100;
        this.animationFrame = 0;
        this.animationDelta = 0;
    }
    Vehicle.prototype.setPositionFromNew = function () {
        this.position = this.newPosition;
    };
    Vehicle.prototype.setAngleFromNew = function () {
        this.angle = this.newAngle;
    };
    Vehicle.prototype.getBoundingSphere = function () {
        return this.getBoundingSphereForPoint(this.position);
    };
    Vehicle.prototype.getBoundingSphereForPoint = function (point) {
        return new sphere_1["default"](new point_1["default"](point.x, point.y), this.boundingSphereRadius);
    };
    Vehicle.prototype.getFrontPin = function () {
        return new point_1["default"](this.position.x + Math.cos(this.angle) * this.size.halfOfWidth, this.position.y + Math.sin(this.angle) * this.size.halfOfWidth);
    };
    Vehicle.prototype.getBackPin = function () {
        return new point_1["default"](this.position.x - Math.cos(this.angle) * this.size.halfOfWidth, this.position.y - Math.sin(this.angle) * this.size.halfOfWidth);
    };
    Vehicle.prototype.dragFromPointAngleAndSetNewPosition = function (point, pointAngle) {
        var objectsDx = point.x - this.position.x;
        var objectsDy = point.y - this.position.y;
        var angle = Math.atan2(objectsDy, objectsDx);
        var maxAngle = utils_1.toRadians(this.maxAngle);
        var angleDelta = this.angle - pointAngle;
        angleDelta = utils_2.normalizeAngle(angleDelta);
        if (angleDelta <= maxAngle && angleDelta >= -maxAngle) {
            this.angle = angle;
        }
        else if (angleDelta > maxAngle) {
            this.angle = angle - angleDelta + maxAngle;
        }
        else if (angleDelta < -maxAngle) {
            this.angle = angle - angleDelta - maxAngle;
        }
        var pinAndDragPointDx = this.getFrontPin().x - this.position.x;
        var pinAndDragPointDy = this.getFrontPin().y - this.position.y;
        var newX = point.x - pinAndDragPointDx;
        var newY = point.y - pinAndDragPointDy;
        this.position = new point_1["default"](newX, newY);
    };
    Vehicle.prototype.updateAnimation = function (timeDiff) {
        if (this.animationDelta > this.msPerFrame) {
            this.animationDelta = 0;
            this.animationFrame++;
            if (this.animationFrame > 1) {
                this.animationFrame = 0;
            }
        }
        else {
            this.animationDelta += timeDiff;
        }
    };
    Vehicle.prototype.isInCollision = function (otherObjects) {
        var collision = false;
        for (var i = 0; i < otherObjects.length; i++) {
            var otherBoundingSphere = otherObjects[i].getBoundingSphere();
            var sphere = this.getBoundingSphereForPoint(this.newPosition);
            if (utils.checkCollision(otherBoundingSphere, sphere)) {
                collision = true;
                break;
            }
        }
        return collision;
    };
    Vehicle.prototype.draw = function () {
        if (configuration_1["default"].debug) {
            this.ctx.save();
            //bounding sphere
            var boundingSphere = this.getBoundingSphere();
            this.ctx.strokeStyle = "#3300aa";
            this.ctx.beginPath();
            this.ctx.arc(boundingSphere.position.x, boundingSphere.position.y, boundingSphere.radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
            // this.ctx.fillStyle = "#3300aa";
            // this.ctx.fillRect(boundingSphere.position.x, boundingSphere.position.y, 3, 3);
            //pin
            // this.ctx.fillStyle = "#5bffa6";
            // this.ctx.fillRect(this.getFrontPin().x, this.getFrontPin().y, 3, 3);
            // this.ctx.fillStyle = "#445cff";
            // this.ctx.fillRect(this.getBackPin().x, this.getBackPin().y, 3, 3);
            // this.ctx.fillStyle = "#ff84bc";
            // this.ctx.fillRect(this.position.x, this.position.y, 3, 3);
            // this.ctx.translate(this.position.x, this.position.y);
            // this.ctx.rotate(this.angle);
            //center
            // this.ctx.strokeStyle = "#ffff00";
            // this.ctx.beginPath();
            // this.ctx.arc(this.xDiff, this.yDiff, boundingSphere.radius, 0,
            //     2 * Math.PI, false);
            // this.ctx.stroke();
            // this.ctx.fillStyle = "#ffce4e";
            // this.ctx.fillRect(this.topLeftOffset.x, this.topLeftOffset.y,4, 4);
            //pivot
            // this.ctx.fillStyle = "#ff33aa";
            // this.ctx.fillRect(0, 0, 3, 3);
            //center - yellow
            this.ctx.fillStyle = "#ffff00";
            this.ctx.fillRect(-this.xDiff, -this.yDiff, 3, 3);
            //box - yellow
            // this.ctx.strokeStyle = "#ffff00";
            // this.ctx.strokeRect(this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
            this.ctx.restore();
        }
    };
    return Vehicle;
}());
exports["default"] = Vehicle;
//# sourceMappingURL=vehicle.js.map