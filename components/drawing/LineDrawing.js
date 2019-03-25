"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _TagDrawing2 = require("./TagDrawing");

var _TagDrawing3 = _interopRequireDefault(_TagDrawing2);

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultLineOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        "stroke-width": 4
    }
};

var LineDrawing = function (_TagDrawing) {
    (0, _inherits3.default)(LineDrawing, _TagDrawing);

    function LineDrawing(option) {
        (0, _classCallCheck3.default)(this, LineDrawing);

        var opt = _deepmerge2.default.all([DefaultLineOption, option, { tag: "line" }]);
        return (0, _possibleConstructorReturn3.default)(this, (LineDrawing.__proto__ || (0, _getPrototypeOf2.default)(LineDrawing)).call(this, opt));
    }

    (0, _createClass3.default)(LineDrawing, [{
        key: "_getLinePosition",
        value: function _getLinePosition() {
            var x1 = parseFloat(this.selection.attr("x1"));
            var x2 = parseFloat(this.selection.attr("x2"));
            var y1 = parseFloat(this.selection.attr("y1"));
            var y2 = parseFloat(this.selection.attr("y2"));
            return {
                x1: x1, x2: x2, y1: y1, y2: y2
            };
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            var _getLinePosition2 = this._getLinePosition(),
                x1 = _getLinePosition2.x1,
                x2 = _getLinePosition2.x2,
                y1 = _getLinePosition2.y1,
                y2 = _getLinePosition2.y2;

            return {
                x: Math.min(x1, x2) + Math.abs(x1 - x2) / 2,
                y: Math.min(y1, y2) + Math.abs(y1 - y2) / 2
            };
        }
    }, {
        key: "moveTo",
        value: function moveTo(vec) {
            if (this.selection) {
                var _getLinePosition3 = this._getLinePosition(),
                    x1 = _getLinePosition3.x1,
                    x2 = _getLinePosition3.x2,
                    y1 = _getLinePosition3.y1,
                    y2 = _getLinePosition3.y2;

                (0, _get3.default)(LineDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LineDrawing.prototype), "render", this).call(this, {
                    x1: x1 + vec.x,
                    x2: x2 + vec.x,
                    y1: y1 + vec.y,
                    y2: y2 + vec.y
                });
            }
        }
    }]);
    return LineDrawing;
}(_TagDrawing3.default);

exports.default = LineDrawing;