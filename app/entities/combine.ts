import * as utils from "../utils";
import Vehicle from "./vehicle";
import configuration from "../configuration";
import Point from "../geometry/point";
import Line from "../geometry/line";
import IsUsingTrailer from "./is_using_trailer";
import Trailer from "./trailer";
import Size from "../geometry/size";

export default class Combine extends Vehicle implements IsUsingTrailer {
    private pouringSpeed: number;
    grain: number;
    maxGrain: any;
    fuel: any;
    maxFuel: any;
    private workingTime: number;
    private defaultWorkingTime: number;
    private workingSpeed: number;
    header: Line;
    back: Line;
    private radiusHeader: number;
    private angleHeader: number;
    private radiusBack: number;
    private angleBack: number;
    private pouring: boolean;

    constructor(position, maxGrain, maxFuel, sprite, ctx) {
        super(position, new Size(71, 80), sprite, ctx);
        this.linearSpeed = configuration.combineLinearSpeed;
        this.pouringSpeed = 100;
        this.grain = 0;
        this.maxGrain = maxGrain;
        this.fuel = maxFuel;
        this.maxFuel = maxFuel;
        this.workingTime = 0;
        this.defaultWorkingTime = 1000;
        this.workingSpeed = 1000;

        this.header = new Line(new Point(0, 0), new Point(0, 0));
        this.back = new Line(new Point(0, 0), new Point(0, 0));

        this.radiusHeader = this.size.height / 2;
        this.angleHeader = utils.toRadians(60);
        let backHeight = this.size.height / 10;
        let centerToBack = this.size.width - 30;
        this.radiusBack = Math.sqrt(Math.pow(backHeight, 2) + Math.pow(centerToBack, 2));
        this.angleBack = Math.atan2(backHeight, centerToBack);

        this.pouring = false;
    }

    isProcessing(): boolean {
        return this.workingTime > 0;
    }

    update(timeDiff: number, rotateDirection: number, moveDirection: number, command: boolean,
        isActive: boolean, otherObjects: Array<Vehicle>): void {

        let timeDelta = timeDiff * 0.001;

        if (isActive) {
            this.pouring = command;

            if (moveDirection !== 0 || this.pouring) {
                this.updateFuel(timeDelta);
            }

            if (this.fuel > 0) {
                let linearDistEachFrame = this.linearSpeed * timeDelta;

                let newAngle = this.angle;
                if (moveDirection === 1) {
                    newAngle += utils.toRadians(linearDistEachFrame * -rotateDirection);
                } else if (moveDirection === -1) {
                    newAngle += utils.toRadians(linearDistEachFrame * rotateDirection);
                }
                newAngle = utils.normalizeAngle(newAngle);
                this.newAngle = newAngle;

                let newX = this.position.x - moveDirection * Math.cos(this.angle) * linearDistEachFrame;
                let newY = this.position.y - moveDirection * Math.sin(this.angle) * linearDistEachFrame;
                this.newPosition = new Point(newX, newY);

                if (!this.isInCollision(otherObjects)) {
                    this.setPositionFromNew();
                    this.setAngleFromNew();
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

    private updateFuel(timeDelta) {
        if (this.fuel > 0) {
            this.fuel -= timeDelta;
        } else {
            this.fuel = 0;
        }
    }

    notifyShouldProcess(): void {
        if (this.grain < this.maxGrain) {
            this.grain += 1;
        }
        this.workingTime = this.defaultWorkingTime;
    }

    updateTrailer(timeDiff: number, trailer: Trailer): void {
        let timeDelta = timeDiff * 0.001;
        if (this.pouring) {
            let distance = utils.distanceBetween(this.position, trailer.position);
            if (this.grain > 0 && distance < this.size.width) {
                this.grain -= timeDelta * this.pouringSpeed;
                if (trailer.grain < trailer.maxGrain) {
                    trailer.grain += timeDelta * this.pouringSpeed;
                }
            }
        }
    }

    draw(): void {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle);
        if (this.isProcessing()) {
            this.ctx.drawImage(this.sprite, this.animationFrame * 20, 80, 20, 20, 
                -this.size.width + 20, -this.size.height / 2 + 31, 20, 20);
        }
        this.ctx.drawImage(this.sprite, 0, 100, this.size.width, this.size.height,
            this.topLeftOffset.x, this.topLeftOffset.y, this.size.width, this.size.height);
        this.ctx.restore();
        super.draw();
    }

    updateHeader(): void {
        let diagonalAngle1 = this.angle + this.angleHeader;
        let diagonalAngle2 = this.angle - this.angleHeader;
        this.header.start.x = Math.cos(diagonalAngle1) * this.radiusHeader + this.position.x;
        this.header.start.y = Math.sin(diagonalAngle1) * this.radiusHeader + this.position.y;
        this.header.end.x = Math.cos(diagonalAngle2) * this.radiusHeader + this.position.x;
        this.header.end.y = Math.sin(diagonalAngle2) * this.radiusHeader + this.position.y;
    }

    updateBack(): void {
        let diagonalAngleBack1 = this.angle + this.angleBack - utils.toRadians(180); //flip to back of combine
        let diagonalAngleBack2 = this.angle - this.angleBack - utils.toRadians(180); //flip to back of combine
        this.back.start.x = Math.cos(diagonalAngleBack1) * this.radiusBack + this.position.x;
        this.back.start.y = Math.sin(diagonalAngleBack1) * this.radiusBack + this.position.y;
        this.back.end.x = Math.cos(diagonalAngleBack2) * this.radiusBack + this.position.x;
        this.back.end.y = Math.sin(diagonalAngleBack2) * this.radiusBack + this.position.y;
    }
};
