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

var _get3 = require("babel-runtime/helpers/get");

var _get4 = _interopRequireDefault(_get3);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _Drawing2 = require("./Drawing");

var _Drawing3 = _interopRequireDefault(_Drawing2);

var _d = require("d3");

var d3 = _interopRequireWildcard(_d);

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultLinkTextOption = {
    attrs: {
        "font-size": "12px",
        fill: "black",
        stroke: "black",
        "dominant-baseline": "middle",
        "text-anchor": "middle"
    }
};

var LinkTextDrawing = function (_Drawing) {
    (0, _inherits3.default)(LinkTextDrawing, _Drawing);

    function LinkTextDrawing(option) {
        (0, _classCallCheck3.default)(this, LinkTextDrawing);

        var opt = (0, _deepmerge2.default)(DefaultLinkTextOption, option || {});
        return (0, _possibleConstructorReturn3.default)(this, (LinkTextDrawing.__proto__ || (0, _getPrototypeOf2.default)(LinkTextDrawing)).call(this, opt));
    }

    (0, _createClass3.default)(LinkTextDrawing, [{
        key: "initialize",
        value: function initialize() {
            var _get2;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get4.default)(LinkTextDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkTextDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            this.selection = d3.select(this.graph.ele).append("text");
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            return {
                x: parseFloat(this.selection.attr("x")),
                y: parseFloat(this.selection.attr("y"))
            };
        }
    }]);
    return LinkTextDrawing;
}(_Drawing3.default);

exports.default = LinkTextDrawing;