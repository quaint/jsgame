/// <reference path="World.ts" />
/// <reference path="InputHandler.ts" />

class Game {

    then: number;
    world: World;
    lastUpdate: number;
    lastElapsed: number;
    inputHandler: InputHandler;

    run() {
        this.setup();
        this.reset();
        this.then = Date.now();
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => {
            this.animate();
            this.main();
        });
    }

    setup() {
        this.world = new World;
        this.inputHandler = new InputHandler(this.world);
    }

    reset() {
        this.world.reset();
    }

    main() {
        var now = Date.now();
        var delta = now - this.lastUpdate;
        this.lastUpdate = now;
        this.lastElapsed = delta;
        this.update(delta / 1000);
        this.render();
    }

    update(modifier: number) {
        this.world.update(modifier);
        this.inputHandler.update(modifier);
    }

    render() {
        this.world.render();
    }
}