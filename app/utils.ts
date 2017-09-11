import Vehicle from './vehicle'
import Size from './basic/size'
import Circle from './basic/circle'
import Collidable from './basic/collidable'
import configuration from './configuration'

        export function normalizeAngle(delta: number): number {
            if (delta > Math.PI) {
                delta -= 2 * Math.PI;
            }
            if (delta < -Math.PI) {
                delta += 2 * Math.PI;
            }
            if (delta > Math.PI || delta < -Math.PI) {
                return normalizeAngle(delta);
            } else {
                return delta;
            }
        }

        export function getRandomInt(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        export function drag(connectedObject: Collidable, movingObject: Collidable, otherObjects: Collidable[]): boolean {
            let objectDx = movingObject.origin.x - connectedObject.origin.x
            let objectDy = movingObject.origin.y - connectedObject.origin.y
            let angle = Math.atan2(objectDy, objectDx)
            let maxAngle = toRadians(connectedObject.maxAngle)

            let delta = connectedObject.angle - movingObject.angle
            delta = normalizeAngle(delta);

            if (delta <= maxAngle && delta >= -maxAngle) {
                connectedObject.angle = angle;
            } else if (delta > maxAngle) {
                connectedObject.angle = angle - delta + maxAngle;
            } else if (delta < -maxAngle) {
                connectedObject.angle = angle - delta - maxAngle;
            }
            
            let objectWidth = connectedObject.getPin().x - connectedObject.origin.x;
            let objectHeight = connectedObject.getPin().y - connectedObject.origin.y;

            let newX = movingObject.origin.x - objectWidth;
            let newY = movingObject.origin.y - objectHeight;

            let collision = false;
            for (let i = 0; i < otherObjects.length; i++) {
                if (checkCollision(otherObjects[i], {
                        origin: {
                            x: newX + Math.cos(connectedObject.angle) * connectedObject.radius,
                            y: newY + Math.sin(connectedObject.angle) * connectedObject.radius
                        },
                        radius: connectedObject.radius
                    })) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                connectedObject.origin.x = newX;
                connectedObject.origin.y = newY;
            }
            return !collision;
        }

        /**
         * Determine if two rectangles overlap.
         * @param {Rectangle}  rectA Object with properties: x, y, width, height.
         * @param {Rectangle}  rectB Object with properties: x, y, width, height.
         * @return {boolean}
         */
        export function intersects(rectA: Vehicle, rectB: Vehicle): boolean {
            return !(rectA.origin.x + rectA.size.width < rectB.origin.x ||
            rectB.origin.x + rectB.size.width < rectA.origin.x ||
            rectA.origin.y + rectA.size.height < rectB.origin.y ||
            rectB.origin.y + rectB.size.height < rectA.origin.y);
        }

        /**
         * Check distance between objects.
         * @param {Vehicle} firstObject to check
         * @param {Vehicle} secondObject to check
         * @returns {boolean} result
         */
        export function checkCollision(firstObject: Circle, secondObject: Circle): boolean {
            let dx = secondObject.origin.x - firstObject.origin.x;
            let dy = secondObject.origin.y - firstObject.origin.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let minDist = firstObject.radius + secondObject.radius;
            return dist < minDist;
        }

        export function toRadians(degrees: number): number {
            return degrees * Math.PI / 180;
        }

        export function toDegrees(radians: number): number {
            return radians * 180 / Math.PI;
        }

