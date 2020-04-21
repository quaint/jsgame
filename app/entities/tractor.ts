import Vehicle from "./vehicle";
import configuration from "../configuration";
import * as utils from "../utils";
import Point from "../geometry/point";
import Size from "../geometry/size";

export default class Tractor extends Vehicle {

    fuel: number;
    maxFuel: number;
    private timeMultiplier = 0.001;

    constructor(position: Point, size: Size, maxFuel: number, sprite, ctx) {
        super(position, size, sprite, ctx);
        this.linearSpeed = configuration.tractorLinearSpeed;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
    }


    update(timeDiff: number, rotateDirection: number, moveDirection: number, isActive: boolean,
           otherObjects: Array<Vehicle>): void {

        if (!isActive) {
            return
        }

        this.adjustLinearSpeedTo(this.connectedObject);

        let timeDelta = timeDiff * this.timeMultiplier;
        let linearDistEachFrame = this.linearSpeed * timeDelta;

        this.updateFuel(timeDelta, moveDirection);

        if (this.fuel > 0) {
            this.updateAngle(moveDirection, linearDistEachFrame, rotateDirection);
            this.updatePosition(moveDirection, linearDistEachFrame);

            if (!this.isInCollision(otherObjects)) {
                if (!this.connectedObject) {
                    this.setPositionFromNew();
                    this.setAngleFromNew();
                    return
                }

                this.connectedObject.dragFromPointAngleAndSetNewPosition(this.getBackPin(), this.newAngle);
                if (!this.connectedObject.isInCollision(otherObjects)) {
                    if (!this.connectedObject.connectedObject) {
                        this.setPositionFromNew();
                        this.setAngleFromNew();
                        this.connectedObject.setPositionFromNew();
                        this.connectedObject.setAngleFromNew();
                        return
                    }

                    this.connectedObject.connectedObject.dragFromPointAngleAndSetNewPosition(
                        this.connectedObject.getBackPin(), this.connectedObject.newAngle);
                    if (!this.connectedObject.connectedObject.isInCollision(otherObjects)) {
                        this.setPositionFromNew();
                        this.setAngleFromNew();
                        this.connectedObject.setPositionFromNew();
                        this.connectedObject.setAngleFromNew();
                        this.connectedObject.connectedObject.setPositionFromNew();
                        this.connectedObject.connectedObject.setAngleFromNew();
                    }
                }
            }
        }
    };

    private updatePosition(moveDirection: number, linearDistEachFrame) {
        let newX = this.position.x - moveDirection * Math.cos(this.newAngle) * linearDistEachFrame;
        let newY = this.position.y - moveDirection * Math.sin(this.newAngle) * linearDistEachFrame;
        this.newPosition = new Point(newX, newY);
    }

    private updateAngle(moveDirection: number, linearDistEachFrame, rotateDirection: number) {
        let newAngle = this.angle;
        if (moveDirection === 1) {
            newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
        } else if (moveDirection === -1) {
            newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
        }
        newAngle = utils.normalizeAngle(newAngle);
        this.newAngle = newAngle;
    }

    private adjustLinearSpeedTo(object: Vehicle): void {
        if (object.workSpeed) {
            this.linearSpeed = object.workSpeed;
        }
    }

    private updateFuel(timeDelta: number, moveDirection: number): void {
        if (moveDirection !== 0) {
            if (this.fuel > 0) {
                this.fuel -= timeDelta;
            } else {
                this.fuel = 0;
            }
        }
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