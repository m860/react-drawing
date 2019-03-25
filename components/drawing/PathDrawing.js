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

var DefaultPathOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": 4
    }
};

var PathDrawing = function (_TagDrawing) {
    (0, _inherits3.default)(PathDrawing, _TagDrawing);

    function PathDrawing(option) {
        (0, _classCallCheck3.default)(this, PathDrawing);

        var opt = _deepmerge2.default.all([DefaultPathOption, option, { tag: "path" }]);

        var _this = (0, _possibleConstructorReturn3.default)(this, (PathDrawing.__proto__ || (0, _getPrototypeOf2.default)(PathDrawing)).call(this, opt));

        if (!option.d || option.d.length === 0) {
            throw new Error("option.d is required");
        }
        _this.d = option.d;
        return _this;
    }

    (0, _createClass3.default)(PathDrawing, [{
        key: "render",
        value: function render() {
            var nextAttrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            (0, _get3.default)(PathDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(PathDrawing.prototype), "render", this).call(this, { d: this.formatPath(this.d) });
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            return null;
        }
    }, {
        key: "moveTo",
        value: function moveTo(vec) {}
    }]);
    return PathDrawing;
}(_TagDrawing3.default);

exports.default = PathDrawing;