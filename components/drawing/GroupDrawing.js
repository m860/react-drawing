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

var _TagDrawing = require("./TagDrawing");

var _TagDrawing2 = _interopRequireDefault(_TagDrawing);

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _Drawing2 = require("./Drawing");

var _Drawing3 = _interopRequireDefault(_Drawing2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GroupDrawing = function (_Drawing) {
    (0, _inherits3.default)(GroupDrawing, _Drawing);

    function GroupDrawing(option) {
        (0, _classCallCheck3.default)(this, GroupDrawing);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GroupDrawing.__proto__ || (0, _getPrototypeOf2.default)(GroupDrawing)).call(this, option));

        if (!option.drawings) {
            throw new Error("option.drawings is required");
        }
        _this.drawings = option.drawings.map(function (drawing) {
            var func = _index2.default[drawing.type];
            if (!func) {
                throw new Error(drawing.type + " is not defined");
            }
            return new func(drawing.option);
        });
        return _this;
    }

    (0, _createClass3.default)(GroupDrawing, [{
        key: "initialize",
        value: function initialize() {
            var _get2;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_get2 = (0, _get4.default)(GroupDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupDrawing.prototype), "initialize", this)).call.apply(_get2, [this].concat(args));
            this.drawings.forEach(function (drawing) {
                return drawing.initialize.apply(drawing, args);
            });
        }

        // render(nextArrts = {}) {
        //     super.render(nextArrts);
        //     this.drawings.forEach((drawing: IDrawing) => drawing.render());
        // }

    }, {
        key: "remove",
        value: function remove() {
            this.drawings.forEach(function (drawing) {
                return drawing.remove();
            });
            (0, _get4.default)(GroupDrawing.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupDrawing.prototype), "remove", this).call(this);
        }
    }, {
        key: "moveTo",
        value: function moveTo(vec) {
            this.drawings.forEach(function (drawing) {
                return drawing.moveTo(vec);
            });
        }
    }]);
    return GroupDrawing;
}(_Drawing3.default);

exports.default = GroupDrawing;