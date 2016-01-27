/// <reference path="Entity.ts"/>

class Vehicle extends Entity {
    
    capacity: number = 0;
    load: number = 0;
    speed: number = 128;
    direction: number = 0;

    
    viewOffsetX(width: number): number {
        return (width / 2) - (this.destinationWidth / 2);
    }

    viewOffsetY(height: number): number {
        return (height / 2) - (this.destinationHeight / 2);
    }
   
    reset(width: number, height: number) {
        this.x = this.viewOffsetX(width);
        this.y = this.viewOffsetY(height);
    }
    
    collision(x: number, y: number): boolean {
        this.world.collidableSprites().forEach(sprite => {
            if (y > sprite.y - this.destinationHeight && y < sprite.y + sprite.destinationHeight && x > sprite.x - this.destinationWidth && x < sprite.x + sprite.destinationWidth) {
                return true;
            }
        });
        return false;
    }

    velocity(mod: number): number {
        return this.speed * mod;
    }

    up(mod: number) {
        this.direction = 64;
        var y = this.y - this.velocity(mod);
        if (y > 0 && !this.collision(this.x, y)) {
            this.y -= this.velocity(mod);
        }
    }
    
    down(mod: number, height: number) {
        this.direction = 0;
        var y = this.y + this.velocity(mod);
        if (y < height - this.destinationHeight && !this.collision(this.x, y)) {
            this.y += this.velocity(mod);
        }
    }

    left(mod: number) {
        this.direction = 128;
        var x = this.x - this.velocity(mod);
        if (x > 0 && !this.collision(x, this.y)) {
            this.x -= this.velocity(mod); 
        }
    }
    
    right(mod: number, width: number) {
        this.direction = 192;
        var x = this.x + this.velocity(mod);
        if (x < width - this.destinationWidth && !this.collision(x, this.y)) {
            this.x += this.velocity(mod);
        }
    }

}