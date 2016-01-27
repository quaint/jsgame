/// <reference path="Vehicle.ts"/>

class Combine extends Vehicle {
    
    sourceWidth: number = 71;
    sourceHeight: number = 80;
    destinationWidth: number = 71;
    destinationHeight: number = 80;
    sourceY: number = 577;

    constructor(world: World) {
        super(world);
    }

    draw() {
        this.destinationX = this.world.heroViewOffsetX();
        this.destinationY = this.world.heroViewOffsetY();
        super.draw();
    }

}