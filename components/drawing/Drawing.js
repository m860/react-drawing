"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _v = require("uuid/v1");

var _v2 = _interopRequireDefault(_v);

var _deepcopy = require("deepcopy");

var _deepcopy2 = _interopRequireDefault(_deepcopy);

var _D3Graph = require("../D3Graph");

var _deepmerge = require("deepmerge");

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _DrawingEmitter = require("./DrawingEmitter");

var _DrawingEmitter2 = _interopRequireDefault(_DrawingEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Drawing = function () {
    function Drawing(option) {
        (0, _classCallCheck3.default)(this, Drawing);

        this.id = option.id ? option.id : (0, _v2.default)();
        this.attrs = option.attrs;
        this.selectedAttrs = option.selectedAttrs;
        this.text = option.text;
        this.ready = false;
        this.selected = false;
        if (option.anchors && option.anchors.length > 0) {
            var AnchorDrawing = require("./AnchorDrawing").default;
            this.anchors = option.anchors.map(function (anchorOpt) {
                return new AnchorDrawing(anchorOpt);
            });
        } else {
            this.anchors = [];
        }
        this.listeners = [];
    }

    (0, _createClass3.default)(Drawing, [{
        key: "applyAttrs",
        value: function applyAttrs() {
            var _this = this;

            var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (this.selection) {
                this.selection.call(function (self) {
                    for (var key in attrs) {
                        if (["x", "x1", "x2", "cx"].indexOf(key) >= 0) {
                            self.attr(key, _this.graph.toScreenX(attrs[key]));
                        } else if (["y", "y1", "y2", "cy"].indexOf(key) >= 0) {
                            self.attr(key, _this.graph.toScreenY(attrs[key]));
                        } else {
                            self.attr(key, attrs[key]);
                        }
                    }
                });
                this.selection.attr("shape-id", this.id);
                this.text && this.selection.text(this.text);
            } else {
                throw new Error("图形还没有初始化");
            }
        }
    }, {
        key: "initialize",
        value: function initialize(graph) {
            this.graph = graph;
            this.ready = true;
            //initial AnchorDrawing
            this.anchors.forEach(function (anchor) {
                return anchor.initialize(graph);
            });
        }
    }, {
        key: "render",
        value: function render() {
            var nextAttrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var attrs = _deepmerge2.default.all([this.attrs, this.selected ? this.selectedAttrs : {}, nextAttrs]);
            this.applyAttrs(attrs);
            var position = this.getPosition();
            this.anchors.forEach(function (anchor) {
                var anchorOffset = anchor.getOffset();
                anchor.render({
                    cx: position.x + anchorOffset.x,
                    cy: position.y + anchorOffset.y
                });
            });
        }
    }, {
        key: "select",
        value: function select() {
            if (this.graph) {
                this.graph.doActionsAsync([new _D3Graph.SelectAction(this.id)]);
            }
        }
    }, {
        key: "remove",
        value: function remove() {
            if (this.selection) {
                this.selection.remove();
            }
            this.selection = null;
            this.listeners.forEach(function (listener) {
                return listener.remove();
            });
            this.anchors.forEach(function (anchor) {
                return anchor.remove();
            });
        }
    }, {
        key: "moveTo",
        value: function moveTo(vec) {
            throw new Error("Not implementation");
        }
    }, {
        key: "getPosition",
        value: function getPosition() {
            throw new Error("Not implementation");
        }
    }, {
        key: "toData",
        value: function toData() {
            return {
                type: this.type,
                option: {
                    id: this.id,
                    attrs: (0, _deepcopy2.default)(this.attrs),
                    text: this.text
                }
            };
        }
    }, {
        key: "findAnchor",
        value: function findAnchor(id) {
            return this.anchors.find(function (f) {
                return f.id === id;
            });
        }
    }, {
        key: "once",
        value: function once(name, callback) {
            var listener = _DrawingEmitter2.default.once(name, callback);
            this.listeners.push(listener);
        }
    }, {
        key: "addListener",
        value: function addListener(name, callback) {
            var listener = _DrawingEmitter2.default.addListener(name, callback);
            console.log("listen : " + name);
            this.listeners.push(listener);
        }
    }, {
        key: "emit",
        value: function emit(name, data) {
            console.log("emit : " + name);
            _DrawingEmitter2.default.emit(name, data);
        }
    }]);
    return Drawing;
}();

exports.default = Drawing;