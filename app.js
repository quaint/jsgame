requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(['app/main'], function () {
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
});