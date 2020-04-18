"use strict";
exports.__esModule = true;
var size_1 = require("../geometry/size");
var Bar = /** @class */ (function () {
    function Bar(position, warningLevel, warningBelow, title) {
        this.position = position;
        this.warningLevel = warningLevel;
        this.warningBelow = warningBelow;
        this.title = title;
        this.size = new size_1["default"](20, 100);
        this.textMargin = 12;
        this.level = 0;
    }
    Bar.prototype.updateLevel = function (level) {
        this.level = level;
    };
    return Bar;
}());
exports["default"] = Bar;
//# sourceMappingURL=bar.js.map