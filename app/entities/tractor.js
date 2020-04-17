import Vehicle from "./vehicle";
import configuration from "../configuration";
import * as utils from "../utils";
import Sphere from "../geometry/sphere";
import Point from "../geometry/point";
import Size from "../geometry/size";

export default class Tractor extends Vehicle {
    constructor(position, size, anchor, maxFuel, sprite, ctx) {
        super(position, size, anchor, sprite, ctx);
        this.linearSpeed = configuration.tractorLinearSpeed;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
        this.radius = this.size.width * 0.5;
    }

    update(timeDiff, rotateDirection, moveDirection, command, isActive, otherObjects) {
        if (isActive) {
            let timeDelta = timeDiff * 0.001;
            if (this.connectedObject.workSpeed) {
                this.linearSpeed = this.connectedObject.workSpeed;
            }
            let linearDistEachFrame = this.linearSpeed * timeDelta;

            if (moveDirection !== 0) {
                if (this.fuel > 0) {
                    this.fuel -= timeDelta;
                } else {
                    this.fuel = 0;
                }
            }

            if (this.fuel > 0) {
                let newAngle = this.angle;
                if (moveDirection === 1) {
                    newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                } else if (moveDirection === -1) {
                    newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils.normalizeAngle(newAngle);

                let newX = this.position.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                let newY = this.position.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;

                let collision = false;
                let newBoundingSphere = this.createBoundingSphere(new Point(newX, newY));
                for (let i = 0; i < otherObjects.length; i++) {
                    let otherBoundingSphere = otherObjects[i].getBoundingSphere();
                    if (utils.checkCollision(otherBoundingSphere, newBoundingSphere)) {
                        collision = true;
                        break;
                    }
                }

                if (!collision) {
                    if (this.connectedObject) {
                        let firstConnectedObj = this.createCheckObject(this.connectedObject);
                        let newObj = {
                            position: new Point(newX, newY),
                            angle: this.angle,
                            maxAngle: this.maxAngle,
                        };
                        let canDragFirst = utils.drag(firstConnectedObj, newObj, otherObjects);
                        if (canDragFirst && this.connectedObject.connectedObject) {
                            let secondConnectedObj = this.createCheckObject(this.connectedObject.connectedObject);
                            let canDragSecond = utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                            if (canDragSecond) {
                                updateObjectsPosition(this.connectedObject, firstConnectedObj);
                                updateObjectsPosition(this.connectedObject.connectedObject, secondConnectedObj);
                                let newObj = {position: new Point(newX, newY), angle: newAngle};
                                updateObjectsPosition(this, newObj);
                            }
                        } else if (canDragFirst) {
                            updateObjectsPosition(this.connectedObject, firstConnectedObj);
                            let newObj = {position: new Point(newX, newY), angle: newAngle};
                            updateObjectsPosition(this, newObj);
                        }
                    } else {
                        let newObj = {position: new Point(newX, newY), angle: newAngle};
                        updateObjectsPosition(this, newObj);
                    }
                }
            }
        }
    };

    createCheckObject(obj) {
        return {
            radius: obj.boundingSphereRadius,
            size: obj.size,
            position: obj.position,
            angle: obj.angle,
            maxAngle: obj.maxAngle,
            getPin: function () {
                return new Point(
                    this.position.x + Math.cos(this.angle) * (this.size.width - 0),
                    this.position.y + Math.sin(this.angle) * (this.size.width - 0)
                );
            }
        };
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        // this.ctx.strokeRect(this.anchor.x * -this.size.width, this.anchor.y * -this.size.height, this.size.width,
        //     this.size.height);
        this.ctx.drawImage(this.sprite, 0, 205, this.size.width, this.size.height,
            this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            let boundingSphere = this.getBoundingSphere();
            this.ctx.arc(boundingSphere.position.x, boundingSphere.position.y, boundingSphere.radius, 0, 2 * Math.PI, false);
            // this.ctx.strokeRect(this.position.x, this.position.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
        // this.ctx.fillRect(this.position.x, this.position.y, 5, 5);
    }

    createBoundingSphere(point) {
        return new Sphere(new Point(
            point.x + Math.cos(this.angle) * this.radius,
            point.y + Math.sin(this.angle) * this.radius),
            this.radius
        )
    }
}

function updateObjectsPosition(object, newObject) {
    object.position = newObject.position;
    object.angle = newObject.angle;
}
