/// <reference path="World.ts" />

declare var $;

class InputHandler {
    keysDown: { [key: number]: boolean } = {};

    constructor(public world: World) {
        $("body").keydown( (e) => {
            this.keysDown[e.keyCode] = true;
        });
        $("body").keyup( (e) => {
            delete this.keysDown[e.keyCode];
        });
    }

    update(modifier) {
        if (38 in this.keysDown) {
            this.world.up(modifier);
        }
        if (40 in this.keysDown) {
            this.world.down(modifier);
        }
        if (37 in this.keysDown) {
            this.world.left(modifier);
        }
        if (39 in this.keysDown) {
            this.world.right(modifier);
        }
    }
}