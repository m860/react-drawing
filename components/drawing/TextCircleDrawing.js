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

var _CircleDrawing2 = require("./CircleDrawing");

var _CircleDrawing3 = _interopRequireDefault(_CircleDrawing2);

var _TextDrawing = require("./TextDrawing");

var _TextDrawing2 = _interopRequireDefault(_TextDrawing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextCircleDrawing = function (_CircleDrawing) {
    (0, _inherits3.default)(TextCircleDrawing, _CircleDrawing);

    function TextCircleDrawing(option) {
        (0, _classCallCheck3.default)(this, TextCircleDrawing);

        if (!option.textOption) {
            throw new Error("option.textOption and option.circleOption is required");
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, (TextCircleDrawing.__proto__ || (0, _getPrototypeOf2.default)(TextCircleDrawing)).call(this, option));

        _this.textDrawing = new _TextDrawing2.default(option.textOption);
        return _this;
    }

    (0, _createClass3.default)(TextCircleDrawing, [{
        key: "initialize",
        value: function initialize() {
            var _get2, _textDrawing;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get5.default)(TextCircleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextCircleDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            (_textDrawing = this.textDrawing).initialize.apply(_textDrawing, args);
        }
    }, {
        key: "render",
        value: function render() {
            var _get3;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            (_get3 = (0, _get5.default)(TextCircleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextCircleDrawing.prototype), "render", this)).call.apply(_get3, [this].concat(args));
            var position = this.getPosition();
            this.textDrawing.render({ x: position.x, y: position.y });
        }
    }, {
        key: "moveTo",
        value: function moveTo(vec) {
            (0, _get5.default)(TextCircleDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextCircleDrawing.prototype), "moveTo", this).call(this, vec);
            var position = this.getPosition();
            this.textDrawing.render({ x: position.x, y: position.y });
        }
    }]);
    return TextCircleDrawing;
}(_CircleDrawing3.default);

exports.default = TextCircleDrawing;