"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _CircleDrawing2 = require("./CircleDrawing");

var _CircleDrawing3 = _interopRequireDefault(_CircleDrawing2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultDotOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        r: 6
    }
};

var DotDrawing = function (_CircleDrawing) {
    (0, _inherits3.default)(DotDrawing, _CircleDrawing);

    function DotDrawing(option) {
        (0, _classCallCheck3.default)(this, DotDrawing);

        var opt = _deepmerge2.default.all([DefaultDotOption, option]);
        return (0, _possibleConstructorReturn3.default)(this, (DotDrawing.__proto__ || (0, _getPrototypeOf2.default)(DotDrawing)).call(this, opt));
    }

    return DotDrawing;
}(_CircleDrawing3.default);

exports.default = DotDrawing;