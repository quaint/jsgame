/// <reference path="Sprite.ts" />

class Entity extends Sprite {
    draw() {
        if (this.world.atViewLimitLeft()) {
            this.destinationX = this.x;
        }
        if (this.world.atViewLimitTop()) {
            this.destinationY = this.y;
        }
        if (this.world.atViewLimitRight()) {
            this.destinationX = this.x - this.world.viewWidthLimit();
        }
        if (this.world.atViewLimitBottom()) {
            this.destinationY = this.y - this.world.viewHeightLimit();
        }
        this.drawImage(this.sourceX, this.sourceY, this.destinationX, this.destinationY);
    }
}