/// <reference path="Game.ts" />

declare var Zepto;
var $ = Zepto;

$(function() {
    var game = new Game;
    game.run();
});