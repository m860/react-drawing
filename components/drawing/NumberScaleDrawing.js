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

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _d = require("d3");

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultNumberScaleOption = {
    original: {
        x: 20,
        y: 280
    },
    xAxisLength: 360,
    yAxisLength: 260,
    scale: 20
};

var NumberScaleDrawing = function (_Drawing) {
    (0, _inherits3.default)(NumberScaleDrawing, _Drawing);

    function NumberScaleDrawing(option) {
        (0, _classCallCheck3.default)(this, NumberScaleDrawing);

        var opt = (0, _deepmerge2.default)(DefaultNumberScaleOption, option || {});

        var _this = (0, _possibleConstructorReturn3.default)(this, (NumberScaleDrawing.__proto__ || (0, _getPrototypeOf2.default)(NumberScaleDrawing)).call(this, opt));

        _this.original = opt.original;
        _this.xAxisLength = opt.xAxisLength;
        _this.yAxisLength = opt.yAxisLength;
        _this.scale = opt.scale;
        return _this;
    }

    (0, _createClass3.default)(NumberScaleDrawing, [{
        key: "initialize",
        value: function initialize() {
            var _get2,
                _this2 = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get4.default)(NumberScaleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(NumberScaleDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            this.selection = d3.select(this.graph.ele).append("g");
            var xEndPoint = {
                x: this.original.x + this.xAxisLength,
                y: this.original.y
            }; // new Point(this.original.x + this.xAxisLength, this.original.y);
            var yEndPoint = {
                x: this.original.x,
                y: this.original.y - this.yAxisLength
            }; // new Point(this.original.x, this.original.y - this.yAxisLength)
            //xAxis
            this.selection.append("line").attr("x1", this.original.x).attr("y1", this.original.y).attr("x2", xEndPoint.x).attr("y2", xEndPoint.y).attr("stroke", "black").attr("stroke-width", "1px");
            //画x轴的箭头
            this.selection.append("path").attr("d", "M " + xEndPoint.x + " " + xEndPoint.y + " L " + xEndPoint.x + " " + (xEndPoint.y + 5) + " L " + (xEndPoint.x + 15) + " " + xEndPoint.y + " L " + xEndPoint.x + " " + (xEndPoint.y - 5) + " Z");
            // 画x轴的刻度
            var xScaleCount = Math.floor(Math.abs(xEndPoint.x - this.original.x) / this.scale);
            var preTextPositionWithX = 0;
            Array.apply(null, { length: xScaleCount }).forEach(function (v, i) {
                var p1 = {
                    x: _this2.original.x + _this2.scale * i,
                    y: _this2.original.y
                }; // new Point(originalPoint.x + this.scale * i, originalPoint.y);
                var p2 = {
                    x: _this2.original.x + _this2.scale * i,
                    y: _this2.original.y - 3
                }; // new Point(originalPoint.x + this.scale * i, originalPoint.y - 3)
                _this2.selection.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1);
                var dis = p1.x - preTextPositionWithX;
                if (dis >= 20) {
                    preTextPositionWithX = p1.x;
                    _this2.selection.append("text").text(i).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("x", p1.x).attr("y", p1.y + 10).attr("style", "font-size:10px");
                }
            });
            //yAxis
            this.selection.append("line").attr("x1", this.original.x).attr("y1", this.original.y).attr("x2", yEndPoint.x).attr("y2", yEndPoint.y).attr("stroke", "black").attr("stroke-width", 1);
            //画y轴的箭头
            this.selection.append("path").attr("d", "M " + yEndPoint.x + " " + yEndPoint.y + " L " + (yEndPoint.x + 5) + " " + yEndPoint.y + " L " + yEndPoint.x + " " + (yEndPoint.y - 15) + " L " + (yEndPoint.x - 5) + " " + yEndPoint.y + " Z");
            //画y轴的刻度
            var yScaleCount = Math.floor(Math.abs(yEndPoint.y - this.original.y) / this.scale);
            var preTextPositionWithY = this.original.y;
            Array.apply(null, { length: yScaleCount }).forEach(function (v, i) {
                var p1 = {
                    x: _this2.original.x,
                    y: _this2.original.y - _this2.scale * i
                }; //new Point(this.original.x, this.original.y - this.scale * i);
                var p2 = {
                    x: _this2.original.x + 3,
                    y: _this2.original.y - _this2.scale * i
                }; // new Point(this.original.x + 3, this.original.y - this.scale * i)
                _this2.selection.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1);
                var dis = preTextPositionWithY - p1.y;
                if (dis >= 20) {
                    preTextPositionWithY = p1.y;
                    _this2.selection.append("text").text(i).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("x", p1.x - 15).attr("y", p1.y).attr("style", "font-size:10px");
                }
            });
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            return null;
        }
    }]);
    return NumberScaleDrawing;
}(_Drawing3.default);

exports.default = NumberScaleDrawing;