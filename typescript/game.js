/// <reference path="World.ts" />
/// <reference path="InputHandler.ts" />
var Game = (function () {
    function Game() {
    }
    Game.prototype.run = function () {
        this.setup();
        this.reset();
        this.then = Date.now();
        this.animate();
    };
    Game.prototype.animate = function () {
        var _this = this;
        window.requestAnimationFrame(function () {
            _this.animate();
            _this.main();
        });
    };
    Game.prototype.setup = function () {
        this.world = new World;
        this.inputHandler = new InputHandler(this.world);
    };
    Game.prototype.reset = function () {
        this.world.reset();
    };
    Game.prototype.main = function () {
        var now = Date.now();
        var delta = now - this.lastUpdate;
        this.lastUpdate = now;
        this.lastElapsed = delta;
        this.update(delta / 1000);
        this.render();
    };
    Game.prototype.update = function (modifier) {
        this.inputHandler.update(modifier);
    };
    Game.prototype.render = function () {
        this.world.render(this.lastUpdate, this.lastElapsed);
    };
    return Game;
})();
