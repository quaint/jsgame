import * as utils from "./utils";
import Vehicle from "./vehicle";
import configuration from "./configuration";
import Sphere from "./sphere";
import Point from "./point";

export default class Combine extends Vehicle {

    /*
     * @param {Point} position
     * @param {Size} size
     * @param {Number} maxGrain
     * @param {Number} maxFuel
     * @param {object} sprite
     * @params {object} ctx
     */
    constructor(position, size, maxGrain, maxFuel, sprite, ctx) {
        super(position, size, sprite, ctx);
        this.linearSpeed = configuration.combineLinearSpeed;
        this.pouringSpeed = 100;
        this.grain = 0;
        this.maxGrain = maxGrain;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
        this.workingTime = 0;
        this.defaultWorkingTime = 1000;
        this.workingSpeed = 1000;

        this.header = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };

        this.back = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };

        this.radiusHeader = this.size.height / 2;
        this.angleHeader = utils.toRadians(60);
        let backHeight = this.size.height / 10;
        let centerToBack = this.size.width - 30;
        this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        this.angleBack = Math.atan2(backHeight, centerToBack);

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
                    let sphere = new Sphere(new Point(newX, newY), this.radius);
                    if (utils.checkCollision(otherObjects[i], sphere)) {
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
        // this.ctx.fillRect(this.position.x, this.position.y, 20, 20);
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        if (this.isProcessing()) {
            this.ctx.drawImage(this.sprite, this.animationFrame * 20, 80, 20, 20, -this.size.width + 20, -this.size.height / 2 + 31, 20, 20);
        }
        this.ctx.drawImage(this.sprite, 0, 100, this.size.width, this.size.height, -this.size.width + 30, -this.size.height / 2, this.size.width, this.size.height);
        this.ctx.restore();
        if (configuration.debug) {
            this.ctx.beginPath();
            this.ctx.arc(this.getBoundingSphere().position.x, this.getBoundingSphere().position.y, this.getBoundingSphere().radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
    }

    getBoundingSphere() {
        return new Sphere(new Point(this.position.x, this.position.y), this.size.width / 2);
    }

    updateHeader() {
        let diagonalAngle1 = this.angle + this.angleHeader;
        let diagonalAngle2 = this.angle - this.angleHeader;
        this.header.x1 = Math.cos(diagonalAngle1) * this.radiusHeader + this.position.x;
        this.header.y1 = Math.sin(diagonalAngle1) * this.radiusHeader + this.position.y;
        this.header.x2 = Math.cos(diagonalAngle2) * this.radiusHeader + this.position.x;
        this.header.y2 = Math.sin(diagonalAngle2) * this.radiusHeader + this.position.y;
    }

    updateBack() {
        let diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of combine
        let diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of combine
        this.back.x1 = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.y1 = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.x2 = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.y2 = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    }
};
