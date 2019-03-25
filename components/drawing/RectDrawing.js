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

var DefaultRectOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        width: 100,
        height: 50
    }
};

var RectDrawing = function (_TagDrawing) {
    (0, _inherits3.default)(RectDrawing, _TagDrawing);

    function RectDrawing(option) {
        (0, _classCallCheck3.default)(this, RectDrawing);

        var opt = _deepmerge2.default.all([DefaultRectOption, option, { tag: "rect" }]);
        return (0, _possibleConstructorReturn3.default)(this, (RectDrawing.__proto__ || (0, _getPrototypeOf2.default)(RectDrawing)).call(this, opt));
    }

    (0, _createClass3.default)(RectDrawing, [{
        key: "getPosition",
        value: function getPosition() {
            return {
                x: parseFloat(this.selection.attr("x")),
                y: parseFloat(this.selection.attr("y"))
            };
        }
    }, {
        key: "moveTo",
        value: function moveTo(vec) {
            if (this.selection) {
                var _getPosition = this.getPosition(),
                    x = _getPosition.x,
                    y = _getPosition.y;

                (0, _get3.default)(RectDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(RectDrawing.prototype), "render", this).call(this, {
                    cx: x + vec.x,
                    cy: y + vec.y
                });
            }
        }
    }]);
    return RectDrawing;
}(_TagDrawing3.default);

exports.default = RectDrawing;