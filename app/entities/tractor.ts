import Vehicle from "./vehicle";
import configuration from "../configuration";
import * as utils from "../utils";
import Point from "../geometry/point";
import Size from "../geometry/size";

export default class Tractor extends Vehicle {

    fuel: number;
    maxFuel: number;

    constructor(position: Point, size: Size, maxFuel: number, sprite, ctx) {
        super(position, size, sprite, ctx);
        this.linearSpeed = configuration.tractorLinearSpeed;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
    }

    update(timeDiff: number, rotateDirection: number, moveDirection: number, isActive: boolean,
           otherObjects: Array<Vehicle>): void {

        if (isActive) {
            let timeDelta = timeDiff * 0.001;
            if (this.connectedObject.workSpeed) {
                this.linearSpeed = this.connectedObject.workSpeed;
            }

            let linearDistEachFrame = this.linearSpeed * timeDelta;

            if (moveDirection !== 0) {
                this.updateFuel(timeDelta);
            }

            if (this.fuel > 0) {
                let newAngle = this.angle;
                if (moveDirection === 1) {
                    newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                } else if (moveDirection === -1) {
                    newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils.normalizeAngle(newAngle);
                this.newAngle = newAngle;

                let newX = this.position.x - moveDirection * Math.cos(newAngle) * linearDistEachFrame;
                let newY = this.position.y - moveDirection * Math.sin(newAngle) * linearDistEachFrame;
                this.newPosition = new Point(newX, newY);


                if (!this.isInCollision(otherObjects)) {
                    this.setPositionFromNew();
                    this.setAngleFromNew();

                    if (this.connectedObject) {
                        this.connectedObject.dragFromPointAngleAndSetNewPosition(this.getBackPin(), this.angle);
                        // if (!this.connectedObject.isInCollision(otherObjects)) {
                        //     this.connectedObject.setPositionFromNew();
                        //     this.connectedObject.setAngleFromNew();
                        // }

                        if (this.connectedObject.connectedObject) {
                            this.connectedObject.connectedObject.dragFromPointAngleAndSetNewPosition(
                                this.connectedObject.getBackPin(), this.connectedObject.angle);
                            // if (!this.connectedObject.connectedObject.isInCollision(otherObjects)) {
                            //     this.connectedObject.connectedObject.setPositionFromNew();
                            //     this.connectedObject.connectedObject.setAngleFromNew();
                            // }
                        }
                    }

                    // if (this.connectedObject) {
                    //     let firstConnectedObj = this.createCheckObject(this.connectedObject);
                    //     let newObj = {
                    //         position: new Point(newX, newY),
                    //         angle: this.angle,
                    //         maxAngle: this.maxAngle,
                    //     };
                    //     let canDragFirst = utils.drag(firstConnectedObj, newObj, otherObjects);
                    //     if (canDragFirst && this.connectedObject.connectedObject) {
                    //         let secondConnectedObj = this.createCheckObject(this.connectedObject.connectedObject);
                    //         let canDragSecond = utils.drag(secondConnectedObj, firstConnectedObj, otherObjects);
                    //         if (canDragSecond) {
                    //             utils.updatePositionAndAngle(this.connectedObject, firstConnectedObj);
                    //             utils.updatePositionAndAngle(this.connectedObject.connectedObject, secondConnectedObj);
                    //             let newObj = {position: new Point(newX, newY), angle: newAngle};
                    //             utils.updatePositionAndAngle(this, newObj);
                    //         }
                    //     } else if (canDragFirst) {
                    //         utils.updatePositionAndAngle(this.connectedObject, firstConnectedObj);
                    //         let newObj = {position: new Point(newX, newY), angle: newAngle};
                    //         utils.updatePositionAndAngle(this, newObj);
                    //     }
                    // } else {
                    //     let newObj = {position: new Point(newX, newY), angle: newAngle};
                    //     utils.updatePositionAndAngle(this, newObj);
                    // }
                }
            }
        }
    };

    private updateFuel(timeDelta): void {
        if (this.fuel > 0) {
            this.fuel -= timeDelta;
        } else {
            this.fuel = 0;
        }
    }

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

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        this.ctx.drawImage(this.sprite, 0, 205, this.size.width, this.size.height,
            this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        this.ctx.restore();
        super.draw();
    }
}