import * as utils from "../utils";
import Vehicle from "./vehicle";
import configuration from "../configuration";
import Sphere from "../geometry/sphere";
import Point from "../geometry/point";
import Line from "../geometry/line";

export default class Combine extends Vehicle {

    /*
     * @param {Point} position
     * @param {Size} size
     * @param {Number} maxGrain
     * @param {Number} maxFuel
     * @param {object} sprite
     * @params {object} ctx
     */
    constructor(position, size, anchor, maxGrain, maxFuel, sprite, ctx) {
        super(position, size, anchor, sprite, ctx);
        this.linearSpeed = configuration.combineLinearSpeed;
        this.pouringSpeed = 100;
        this.grain = 0;
        this.maxGrain = maxGrain;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
        this.workingTime = 0;
        this.defaultWorkingTime = 1000;
        this.workingSpeed = 1000;

        this.header = new Line(new Point(0, 0), new Point(0,0));
        this.back = new Line(new Point(0, 0), new Point(0,0));

        this.radiusHeader = this.size.height / 2;
        this.angleHeader = utils.toRadians(60);
        let backHeight = this.size.height / 10;
        let centerToBack = this.size.width - 30;
        this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        this.angleBack = Math.atan2(backHeight, centerToBack);

        this.anchor = new Point(0.0, 0.5);

        this.pouring = false;
    }

    isProcessing() {
        return this.workingTime > 0;
    }

    update(timeDiff, rotateDirection, moveDirection, command, isActive, otherObjects) {
        let timeDelta = timeDiff * 0.001;

        if (isActive) {

            let linearDistEachFrame = this.linearSpeed * timeDelta;
            this.pouring = command;

            if (moveDirection !== 0 || this.pouring) {
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

                let newX = this.position.x - moveDirection * Math.cos(this.angle) * linearDistEachFrame;
                let newY = this.position.y - moveDirection * Math.sin(this.angle) * linearDistEachFrame;

                let collision = false;
                for (let i = 0; i < otherObjects.length; i++) {
                    let sphere = new Sphere(new Point(newX, newY), this.boundingSphereRadius);
                    if (utils.checkCollision(otherObjects[i].getBoundingSphere(), sphere)) {
                        collision = true;
                        break;
                    }
                }

                if (!collision) {
                    this.position.x = newX;
                    this.position.y = newY;
                    this.angle = newAngle;
                    this.updateHeader();
                    this.updateBack();
                }
            }
        }

        if (this.workingTime > 0) {
            this.workingTime -= timeDelta * this.workingSpeed;
        }

        this.updateAnimation(timeDiff);
    }

    notifyShouldProcess() {
        if (this.grain < this.maxGrain) {
            this.grain += 1;
        }
        this.workingTime = this.defaultWorkingTime;
    }

    updateTrailer(timeDiff, trailer) {
        let timeDelta = timeDiff * 0.001;
        if (this.pouring) {
            let distance = this.distanceTo(trailer);
            if (this.grain > 0 && distance < this.size.width) {
                this.grain -= timeDelta * this.pouringSpeed;
                if (trailer.grain < trailer.maxGrain) {
                    trailer.grain += timeDelta * this.pouringSpeed;
                }
            }
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        if (this.isProcessing()) {
            this.ctx.drawImage(this.sprite, this.animationFrame * 20, 80, 20, 20, -this.size.width + 20, -this.size.height / 2 + 31, 20, 20);
        }
        this.ctx.drawImage(this.sprite, 0, 100, this.size.width, this.size.height,
            this.pivot.x, this.pivot.y, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.save();
            this.ctx.strokeStyle = "#00ff00";
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().position.x, this.getBoundingSphere().position.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
            this.ctx.strokeRect(this.position.x + this.pivot.x, this.position.y + this.pivot.y, this.size.width, this.size.height);
            this.ctx.restore();
        }
    }

    updateHeader() {
        let diagonalAngle1 = this.angle + this.angleHeader;
        let diagonalAngle2 = this.angle - this.angleHeader;
        this.header.start.x = Math.cos(diagonalAngle1) * this.radiusHeader + this.position.x;
        this.header.start.y = Math.sin(diagonalAngle1) * this.radiusHeader + this.position.y;
        this.header.end.x = Math.cos(diagonalAngle2) * this.radiusHeader + this.position.x;
        this.header.end.y = Math.sin(diagonalAngle2) * this.radiusHeader + this.position.y;
    }

    updateBack() {
        let diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of combine
        let diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of combine
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    }
};
