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

var _Enums = require("../Enums");

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _DrawingEvents = require("./DrawingEvents");

var _DrawingEvents2 = _interopRequireDefault(_DrawingEvents);

var _LinkTextDrawing = require("./LinkTextDrawing");

var _LinkTextDrawing2 = _interopRequireDefault(_LinkTextDrawing);

var _objectPath = require("object-path");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultLinkOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": 2
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
        if (opt.linkText && opt.linkText.length > 0) {
            //create link text
            _this.linkText = opt.linkText.map(function (linkTextOption) {
                return new _LinkTextDrawing2.default(linkTextOption);
            });
        } else {
            _this.linkText = [];
        }
        return _this;
    }

    (0, _createClass3.default)(LinkDrawing, [{
        key: "_getAllAnchorID",
        value: function _getAllAnchorID() {
            var _from = (0, _slicedToArray3.default)(this.from, 2),
                fromShapeID = _from[0],
                fromAnchorID = _from[1];

            var _to = (0, _slicedToArray3.default)(this.to, 2),
                toShapeID = _to[0],
                toAnchorID = _to[1];

            return [fromAnchorID, toAnchorID];
        }
    }, {
        key: "_getAllAnchors",
        value: function _getAllAnchors() {
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
                    return [fromAnchor, toAnchor];
                }
            }
            return [null, null];
        }

        /**
         * 当anchor
         * @param anchorID
         */

    }, {
        key: "initialize",
        value: function initialize() {
            var _get2;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get4.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            //initial LinkTextDrawing
            this.linkText.forEach(function (linkText) {
                return linkText.initialize.apply(linkText, args);
            });
            switch (this.mode.type) {
                case _Enums.LinkDrawingModeType.line:
                    this.selection = d3.select(this.graph.ele).append("line");
                    break;
                case _Enums.LinkDrawingModeType.lineWithArrow:
                    this.selection = d3.select(this.graph.ele).append("path");
                    break;
                case _Enums.LinkDrawingModeType.multipleLine:
                default:
                    throw new Error("Not implementation");
            }

            var _getAllAnchorID2 = this._getAllAnchorID(),
                _getAllAnchorID3 = (0, _slicedToArray3.default)(_getAllAnchorID2, 2),
                fromAnchorID = _getAllAnchorID3[0],
                toAnchorID = _getAllAnchorID3[1];

            this.addListener(_DrawingEvents2.default.anchorRender(fromAnchorID), this.onAnchorRender);
            this.addListener(_DrawingEvents2.default.anchorRender(toAnchorID), this.onAnchorRender);
        }
    }, {
        key: "renderLine",
        value: function renderLine() {
            var _getAllAnchors2 = this._getAllAnchors(),
                _getAllAnchors3 = (0, _slicedToArray3.default)(_getAllAnchors2, 2),
                fromAnchor = _getAllAnchors3[0],
                toAnchor = _getAllAnchors3[1];

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
    }, {
        key: "render",
        value: function render() {
            if (this.mode.type === _Enums.LinkDrawingModeType.line) {
                this.renderLine();
            } else if (this.mode.type === _Enums.LinkDrawingModeType.lineWithArrow) {
                this.renderLineWithArrow();
            }
            var textBasePosition = this.getTextPosition();
            this.linkText.forEach(function (linkText) {
                linkText.render({
                    x: textBasePosition.x,
                    y: textBasePosition.y
                });
            });
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            return null;
        }
    }, {
        key: "getTextPosition",
        value: function getTextPosition() {
            var _getAllAnchors4 = this._getAllAnchors(),
                _getAllAnchors5 = (0, _slicedToArray3.default)(_getAllAnchors4, 2),
                fromAnchor = _getAllAnchors5[0],
                toAnchor = _getAllAnchors5[1];

            if (fromAnchor && toAnchor) {
                var fromPosition = fromAnchor.getPosition();
                var toPosition = toAnchor.getPosition();
                var hx = Math.abs(fromPosition.x - toPosition.x) / 2;
                var hy = Math.abs(fromPosition.y - toPosition.y) / 2;
                return {
                    x: Math.min(fromPosition.x, toPosition.x) + hx,
                    y: Math.min(fromPosition.y, toPosition.y) + hy
                };
            }
            return null;
        }
    }, {
        key: "remove",
        value: function remove() {
            (0, _get4.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), "remove", this).call(this);
            //remove LinkTextDrawing
            this.linkText.forEach(function (linkText) {
                return linkText.remove();
            });
        }
    }, {
        key: "generatePathForLineWithArrow",
        value: function generatePathForLineWithArrow(begin, end, distance) {
            var diffX = begin.x - end.x;
            var diffY = begin.y - end.y;
            var a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
            var ex = diffX / a;
            var ey = diffY / a;

            var q2x = end.x + ex * distance;
            var q2y = end.y + ey * distance;

            var fx = Math.cos(Math.PI / 2) * ex + Math.sin(Math.PI / 2) * ey;
            var fy = -Math.sin(Math.PI / 2) * ex + Math.cos(Math.PI / 2) * ey;
            var q1x = q2x + fx * distance * 0.5;
            var q1y = q2y + fy * distance * 0.5;

            var gx = Math.cos(-Math.PI / 2) * ex + Math.sin(-Math.PI / 2) * ey;
            var gy = -Math.sin(-Math.PI / 2) * ex + Math.cos(-Math.PI / 2) * ey;
            var q3x = q2x + gx * distance * 0.5;
            var q3y = q2y + gy * distance * 0.5;

            return [{ action: "M", x: begin.x, y: begin.y }, { action: "L", x: q2x, y: q2y }, { action: "L", x: q1x, y: q1y }, { action: "L", x: end.x, y: end.y }, { action: "L", x: q3x, y: q3y }, { action: "L", x: q2x, y: q2y }, { action: "L", x: begin.x, y: begin.y }, { action: "Z" }];
        }
    }, {
        key: "renderLineWithArrow",
        value: function renderLineWithArrow() {
            var _getAllAnchors6 = this._getAllAnchors(),
                _getAllAnchors7 = (0, _slicedToArray3.default)(_getAllAnchors6, 2),
                fromAnchor = _getAllAnchors7[0],
                toAnchor = _getAllAnchors7[1];

            if (fromAnchor && toAnchor) {
                var fromPosition = fromAnchor.getPosition();
                var toPosition = toAnchor.getPosition();
                var distance = (0, _objectPath.get)(this.mode, "option.distance", 5);
                var d = this.generatePathForLineWithArrow(fromPosition, toPosition, distance / this.graph.scale);
                (0, _get4.default)(LinkDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(LinkDrawing.prototype), "render", this).call(this, { d: this.formatPath(d) });
            }
        }
    }]);
    return LinkDrawing;
}(_Drawing3.default);

exports.default = LinkDrawing;