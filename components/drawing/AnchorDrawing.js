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

var _get4 = require("babel-runtime/helpers/get");

var _get5 = _interopRequireDefault(_get4);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _Drawing2 = require("./Drawing");

var _Drawing3 = _interopRequireDefault(_Drawing2);

var _d = require("d3");

var d3 = _interopRequireWildcard(_d);

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _DrawingEvents = require("./DrawingEvents");

var _DrawingEvents2 = _interopRequireDefault(_DrawingEvents);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultAnchorOption = {
    attrs: {
        fill: "blue",
        stroke: "blue",
        r: 4,
        opacity: 0.2
    }
};

/**
 * Anchor的位置是相对于所在图形的getPosition来确定的
 */

var AnchorDrawing = function (_Drawing) {
    (0, _inherits3.default)(AnchorDrawing, _Drawing);

    function AnchorDrawing(option) {
        (0, _classCallCheck3.default)(this, AnchorDrawing);

        var opt = (0, _deepmerge2.default)(DefaultAnchorOption, option || {});

        var _this = (0, _possibleConstructorReturn3.default)(this, (AnchorDrawing.__proto__ || (0, _getPrototypeOf2.default)(AnchorDrawing)).call(this, opt));

        _this.offset = opt.offset;
        return _this;
    }

    (0, _createClass3.default)(AnchorDrawing, [{
        key: "initialize",
        value: function initialize() {
            var _get2;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get5.default)(AnchorDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnchorDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            this.selection = d3.select(this.graph.ele).append("circle");
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            return {
                x: parseFloat(this.selection.attr("cx")),
                y: parseFloat(this.selection.attr("cy"))
            };
        }
    }, {
        key: "render",
        value: function render() {
            var _get3;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            (_get3 = (0, _get5.default)(AnchorDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(AnchorDrawing.prototype), "render", this)).call.apply(_get3, [this].concat(args));
            //通知LinkDrawing重新绘制
            this.emit(_DrawingEvents2.default.anchorRender(this.id));
        }
    }, {
        key: "getOffset",
        value: function getOffset() {
            return this.offset;
        }
    }]);
    return AnchorDrawing;
}(_Drawing3.default);

exports.default = AnchorDrawing;