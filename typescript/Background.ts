/// <reference path="Entity.ts" />

class Background extends Entity {
    
    constructor(world: World) {
        super(world);
        this.destinationWidth = world.viewWidth;
        this.destinationHeight = world.viewHeight;
        this.sourceWidth = world.viewWidth;
        this.sourceHeight = world.viewHeight
    }

    draw() {
        var x = this.world.hero.x - this.world.heroViewOffsetX();
        var y = this.world.hero.y - this.world.heroViewOffsetY();
        if (this.world.atViewLimitLeft()) {
            var x = 0;
        }
        if (this.world.atViewLimitTop()) {
            var y = 0;
        }
        if (this.world.atViewLimitRight()) {
            var x = this.world.viewWidthLimit();
        }
        if (this.world.atViewLimitBottom()) {
            var y = this.world.viewHeightLimit();
        }
        this.drawImage(x, y, this.destinationX, this.destinationY);
    }
}