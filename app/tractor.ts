import Vehicle from './vehicle'
import Machine from './machine'
import Point from './basic/point'
import Circle from './basic/circle'
import Collidable from './basic/collidable'
import Size from './basic/size'
import configuration from './configuration'
import * as utils from './utils'

export default class Tractor extends Machine {

    fuel: number
    maxFuel: number

    constructor(origin: Point, size: Size, maxFuel: number, sprite: HTMLImageElement, ctx: CanvasRenderingContext2D) {
        super(origin, size, sprite, ctx);
        this.linearSpeed = configuration.tractorLinearSpeed;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
        this.anchorY = 0.5;
        this.anchorX = 0.0;
        this.radius = this.size.width * 0.4;
    }

    update(timeDiff: number, rotateDirection: number, moveDirection: number, isActive: boolean, otherObjects: Collidable[]) {
        if (isActive) {
            var timeDelta = timeDiff * 0.001;
            if (this.connectedObject && this.connectedObject.workSpeed) {
                this.linearSpeed = this.connectedObject.workSpeed;
            }
            var linearDistEachFrame = this.linearSpeed * timeDelta;

            if (moveDirection !== 0) {
                if (this.fuel > 0) {
                    this.fuel -= timeDelta;
                } else {
                    this.fuel = 0;
                }
            }

            if (this.fuel > 0) {
                var newAngle = this.angle;
                if (moveDirection === 1) {
                    newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                } else if (moveDirection === -1) {
                    newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils.normalizeAngle(newAngle);

                var newX = this.origin.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                var newY = this.origin.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;

                var collision = false;
                for (var i = 0; i < otherObjects.length; i++) {
                    if (utils.checkCollision(otherObjects[i], {
                        origin: {
                            x: newX + Math.cos(this.angle) * this.radius,
                            y: newY + Math.sin(this.angle) * this.radius
                        },
                        radius: this.radius
                    })) {
                        collision = true;
                        break;
                    }
                }

                if (!collision) {
                    if (this.connectedObject) {
                        var firstConnectedObj = this.createCheckObject(this.connectedObject);
                        var canDragFirst = utils.drag(firstConnectedObj, {
                            origin: {
                                x: newX,
                                y: newY
                            },
                            size: {
                                width: 0,
                                height: 0
                            },
                            angle: this.angle,
                            maxAngle: this.maxAngle,
                            radius: 0,
                            getPin: function() {
                                return {
                                    x: 0,
                                    y: 0
                                }
                            }
                        }, otherObjects);
                        if (canDragFirst && this.connectedObject.connectedObject) {
                            var secondConnectedObj = this.createCheckObject(this.connectedObject.connectedObject);
                            var canDragSecond = utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                            if (canDragSecond) {
                                this.updateObjectsPosition(this.connectedObject, firstConnectedObj);
                                this.updateObjectsPosition(this.connectedObject.connectedObject, secondConnectedObj);
                                this.updateObjectsPosition(this, { origin: { x: newX, y: newY }, angle: newAngle });
                            }
                        } else if (canDragFirst) {
                            this.updateObjectsPosition(this.connectedObject, firstConnectedObj);
                            this.updateObjectsPosition(this, { origin: { x: newX, y: newY }, angle: newAngle });
                        }
                    } else {
                        this.updateObjectsPosition(this, { origin: { x: newX, y: newY }, angle: newAngle });
                    }
                }
            }
        }
    }

    updateObjectsPosition(object: Collidable, newObject: Collidable): void {
        object.origin.x = newObject.origin.x;
        object.origin.y = newObject.origin.y;
        object.angle = newObject.angle;
    }

    createCheckObject(obj: Vehicle): Collidable {
        return {
            radius: obj.radius,
            size: {
                width: obj.size.width,
                height: 0
            },
            origin: {
                x: obj.origin.x,
                y: obj.origin.y
            },
            angle: obj.angle,
            maxAngle: obj.maxAngle,
            getPin: function () {
                var result = {x: 0, y: 0};
                if (this.size) {
                    result = {
                        x: this.origin.x + Math.cos(this.angle) * (this.size.width - 0),
                        y: this.origin.y + Math.sin(this.angle) * (this.size.width - 0)
                    };
                }
                return result;
            }
        };
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.origin.x, this.origin.y);
        this.ctx.rotate(this.angle);
        // this.ctx.strokeRect(this.anchorX * -this.width, this.anchorY * -this.height, this.width,
        //     this.height);
        this.ctx.drawImage(this.sprite, 0, 205, this.size.width, this.size.height,
            this.anchorX * -this.size.width, this.anchorY * -this.size.height, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().origin.x, this.getBoundingSphere().origin.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        // this.ctx.fillRect(this.x, this.y, 5, 5);
    }

    getBoundingSphere(): Circle {
        return {
            origin: {
                x: this.origin.x + Math.cos(this.angle) * this.radius,
                y: this.origin.y + Math.sin(this.angle) * this.radius,
            },
            radius: this.radius
        };
    }

    getPin(): Point {
        return {
            x: 0,
            y: 0
        }
    }
}