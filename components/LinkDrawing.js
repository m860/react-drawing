"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

var _Enums = require("./Enums");

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _DrawingEvents = require("./DrawingEvents");

var _DrawingEvents2 = _interopRequireDefault(_DrawingEvents);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultLinkOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": "1px"
    },
    mode: {
        type: _Enums.LinkDrawingModeType.line
    }
};

var LinkDrawing = function (_Drawing) {
    (0, _inherits3.default)(LinkDrawing, _Drawing);

    function LinkDrawing(option) {
        (0, _classCallCheck3.default)(this, LinkDrawing);

        var opt = (0, _deepmerge2.default)(DefaultLinkOption, option || {});

        var _this = (0, _possibleConstructorReturn3.default)(this, (LinkDrawing.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing)).call(this, opt));

        _this.onAnchorRender = function () {
            _this.render();
        };

        _this.from = opt.from;
        _this.to = opt.to;
        _this.mode = opt.mode;
        return _this;
    }

    /**
     * 当anchor
     * @param anchorID
     */


    (0, _createClass3.default)(LinkDrawing, [{
        key: "initialize",
        value: function initialize() {
            var _get2;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get4.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            switch (this.mode.type) {
                case _Enums.LinkDrawingModeType.line:
                    this.selection = d3.select(this.graph.ele).append("line");
                    break;
                case _Enums.LinkDrawingModeType.lineWithArrow:
                case _Enums.LinkDrawingModeType.multipleLine:
                default:
                    throw new Error("Not implementation");
            }

            var _from = (0, _slicedToArray3.default)(this.from, 2),
                fromShapeID = _from[0],
                fromAnchorID = _from[1];

            var _to = (0, _slicedToArray3.default)(this.to, 2),
                toShapeID = _to[0],
                toAnchorID = _to[1];

            this.addListener(_DrawingEvents2.default.anchorRender(fromAnchorID), this.onAnchorRender);
            this.addListener(_DrawingEvents2.default.anchorRender(toAnchorID), this.onAnchorRender);
        }
    }, {
        key: "render",
        value: function render() {
            var _from2 = (0, _slicedToArray3.default)(this.from, 2),
                fromShapeID = _from2[0],
                fromAnchorID = _from2[1];

            var _to2 = (0, _slicedToArray3.default)(this.to, 2),
                toShapeID = _to2[0],
                toAnchorID = _to2[1];

            var fromShape = this.graph.findShapeById(fromShapeID);
            var toShape = this.graph.findShapeById(toShapeID);
            if (fromShape && toShape) {
                var fromAnchor = fromShape.findAnchor(fromAnchorID);
                var toAnchor = toShape.findAnchor(toAnchorID);
                if (fromAnchor && toAnchor) {
                    var fromPosition = fromAnchor.getPosition();
                    var toPosition = toAnchor.getPosition();
                    var nextAttrs = {
                        x1: fromPosition.x,
                        y1: fromPosition.y,
                        x2: toPosition.x,
                        y2: toPosition.y
                    };
                    (0, _get4.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), "render", this).call(this, nextAttrs);
                }
            }
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            return null;
        }
    }]);
    return LinkDrawing;
}(_Drawing3.default);

exports.default = LinkDrawing;