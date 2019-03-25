'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.MoveToolbar = exports.TextCircleToolbar = exports.ArrowLinkToolbar = exports.LinkToolbar = exports.CircleToolbar = exports.LineToolbar = exports.NoneToolbar = exports.DrawingToolbar = exports.Toolbar = exports.MoveAction = exports.ReDrawAction = exports.ClearAction = exports.DeleteAction = exports.UnSelectAction = exports.SelectAction = exports.DrawAction = exports.InputAction = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.fromDrawing = fromDrawing;
exports.fromActions = fromActions;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _WorkSpace = require('./WorkSpace');

var _WorkSpace2 = _interopRequireDefault(_WorkSpace);

var _objectPath = require('object-path');

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _fbemitter = require('fbemitter');

var _UserInput = require('./UserInput');

var _UserInput2 = _interopRequireDefault(_UserInput);

var _LinkDrawing = require('./drawing/LinkDrawing');

var _LinkDrawing2 = _interopRequireDefault(_LinkDrawing);

var _LineDrawing = require('./drawing/LineDrawing');

var _LineDrawing2 = _interopRequireDefault(_LineDrawing);

var _CircleDrawing = require('./drawing/CircleDrawing');

var _CircleDrawing2 = _interopRequireDefault(_CircleDrawing);

var _index = require('./drawing/index');

var _index2 = _interopRequireDefault(_index);

var _Enums = require('./Enums');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//#region event
var emitter = new _fbemitter.EventEmitter();
//toolbar 按钮切换
/**
 * @todo 实现用户的输入action,输入action是一个中断操作
 * 实现link,arrowLink的label
 * 实现图的drawing
 * @todo 实现transition
 * @todo 实现data action
 *
 * */

var EVENT_TOOLBAR_CHANGE = "EVENT_TOOLBAR_CHANGE";
//图形的位置发生变化
var EVENT_DRAWING_POSITION_CHANGE = "EVENT_DRAWING_POSITION_CHANGE";
//#endregion


var actionIndex = {};

/**
 * 注册Drawing绘制类
 * @param {String} name - name值必须和绘图类的类名保持一致
 * @param {Function} drawing - 绘图类
 * */

function getArrowPoints(startPoint, endPoint) {
    var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

    var diffX = startPoint.x - endPoint.x;
    var diffY = startPoint.y - endPoint.y;
    var a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    var q1x = endPoint.x + distance * (diffX + diffY) / a;
    var q1y = endPoint.y + distance * (diffY - diffX) / a;
    var q3x = endPoint.x + distance * (diffX - diffY) / a;
    var q3y = endPoint.y + distance * (diffX + diffY) / a;
    return [new Point(endPoint.x, endPoint.y), new Point(q1x, q1y), new Point(q3x, q3y)];
}

/**
 * 反序列化drawing
 * */
function fromDrawing(drawingOps) {
    var func = _index2.default[drawingOps.type];
    return new func(drawingOps.option);
}

/**
 * 反序列化actions
 *
 * @example
 *
 * const actions=fromActions([{
 * 	type:"draw",
 * 	params:[{
 * 		type:"LineDrawing",
 * 		option:{
 * 			id:"line1",
 * 			attrs:{}
 * 		}
 * 	}]
 * },{
 * 	type:"draw",
 * 	params:[{
 * 		type:"DotDrawing",
 * 		option:{
 * 			id:"dot1",
 * 			attrs:{}
 * 		}
 * 	}]
 * }])
 *
 * */
function fromActions(actions) {
    return actions.map(function (action) {
        var type = action.type;
        var args = action.params || [];
        var ops = action.ops;
        var func = actionIndex[type];
        if (!func) {
            throw new Error('action ' + type + ' is not defined');
        }
        switch (type) {
            case _Enums.ActionEnum.draw:
                return new (Function.prototype.bind.apply(func, [null].concat((0, _toConsumableArray3.default)(args.map(function (arg) {
                    return fromDrawing(arg);
                }, ops)))))();
            default:
                return new (Function.prototype.bind.apply(func, [null].concat((0, _toConsumableArray3.default)(args), [ops])))();
        }
    });
}

var Point = function Point(x, y) {
    (0, _classCallCheck3.default)(this, Point);

    this.x = x;
    this.y = y;
};

//#region Action
/**
 * action基类
 * */


var Action = function () {
    function Action(type, params, ops) {
        (0, _classCallCheck3.default)(this, Action);

        /**
         * action的类型,是一个枚举值
         * */
        this.type = type;
        /**
         * action的参数
         * @member {Array}
         * */
        this.params = params;
        /**
         * playing模式执行下一步时的时间间隔,默认没有
         * @member {?Number}
         * */
        this.nextInterval = (0, _objectPath.get)(ops, "nextInterval", null);
        /**
         * 是否允许中断操作
         * @type {boolean}
         */
        this.canBreak = false;
    }

    (0, _createClass3.default)(Action, [{
        key: 'toData',
        value: function toData() {
            return {
                type: this.type,
                params: this.params.toData ? [this.params.toData()] : this.params
            };
        }
    }]);
    return Action;
}();

/**
 * 用户输入action,中断操作
 */


var InputAction = exports.InputAction = function (_Action) {
    (0, _inherits3.default)(InputAction, _Action);

    /**
     *
     * @param {Array} params
     * @param {String} params[].label
     * @param {String} params[].fieldName
     * @param {any} params[].defaultValue
     * @param {?Object} ops
     */
    function InputAction(params, ops) {
        (0, _classCallCheck3.default)(this, InputAction);

        var _this = (0, _possibleConstructorReturn3.default)(this, (InputAction.__proto__ || (0, _getPrototypeOf2.default)(InputAction)).call(this, _Enums.ActionEnum.input, params, ops));

        _this.canBreak = true;
        return _this;
    }

    return InputAction;
}(Action);

actionIndex[_Enums.ActionEnum.input] = InputAction;

/**
 * 绘图action
 *
 * @example
 *
 * <D3Graph actions={[
 * 	new DrawAction(new LineDrawing({id:"line1",attrs:{x1:0,y1:0,x2:100,y2:100}})),
 * 	new DrawAction(new DotAction({id:"dot1",attrs:{cx:100,cy:100}}))
 * ]}/>
 *
 * */

var DrawAction = exports.DrawAction = function (_Action2) {
    (0, _inherits3.default)(DrawAction, _Action2);

    function DrawAction(drawingOps, ops) {
        (0, _classCallCheck3.default)(this, DrawAction);
        return (0, _possibleConstructorReturn3.default)(this, (DrawAction.__proto__ || (0, _getPrototypeOf2.default)(DrawAction)).call(this, _Enums.ActionEnum.draw, drawingOps, ops));
    }

    return DrawAction;
}(Action);

actionIndex[_Enums.ActionEnum.draw] = DrawAction;

/**
 * 选择action
 *
 * @example
 *
 * <D3Graph actions={[new SelectAction('SHAPE_ID')]}/>
 *
 * */

var SelectAction = exports.SelectAction = function (_Action3) {
    (0, _inherits3.default)(SelectAction, _Action3);

    function SelectAction(shapeId, ops) {
        (0, _classCallCheck3.default)(this, SelectAction);
        return (0, _possibleConstructorReturn3.default)(this, (SelectAction.__proto__ || (0, _getPrototypeOf2.default)(SelectAction)).call(this, _Enums.ActionEnum.select, shapeId, ops));
    }

    return SelectAction;
}(Action);

actionIndex[_Enums.ActionEnum.select] = SelectAction;

/**
 * 取消选择action
 *
 * @example
 *
 * <D3Graph actions={[new UnSelectAction('SHAPE_ID')]}/>
 *
 * */

var UnSelectAction = exports.UnSelectAction = function (_Action4) {
    (0, _inherits3.default)(UnSelectAction, _Action4);

    function UnSelectAction(shapeId, ops) {
        (0, _classCallCheck3.default)(this, UnSelectAction);
        return (0, _possibleConstructorReturn3.default)(this, (UnSelectAction.__proto__ || (0, _getPrototypeOf2.default)(UnSelectAction)).call(this, _Enums.ActionEnum.unselect, shapeId, ops));
    }

    return UnSelectAction;
}(Action);

actionIndex[_Enums.ActionEnum.unselect] = UnSelectAction;

/**
 * 删除图形action
 *
 * @example
 *
 * <D3Graph actions={[new DeleteAction('SHAPE_ID')]}/>
 *
 * */

var DeleteAction = exports.DeleteAction = function (_Action5) {
    (0, _inherits3.default)(DeleteAction, _Action5);

    function DeleteAction(shapeId, ops) {
        (0, _classCallCheck3.default)(this, DeleteAction);
        return (0, _possibleConstructorReturn3.default)(this, (DeleteAction.__proto__ || (0, _getPrototypeOf2.default)(DeleteAction)).call(this, _Enums.ActionEnum.delete, shapeId, ops));
    }

    return DeleteAction;
}(Action);

actionIndex[_Enums.ActionEnum.delete] = DeleteAction;

/**
 * 清除所有的图形action
 *
 * @example
 *
 * <D3Graph actions={[new ClearAction()]}/>
 *
 * */

var ClearAction = exports.ClearAction = function (_Action6) {
    (0, _inherits3.default)(ClearAction, _Action6);

    function ClearAction(ops) {
        (0, _classCallCheck3.default)(this, ClearAction);
        return (0, _possibleConstructorReturn3.default)(this, (ClearAction.__proto__ || (0, _getPrototypeOf2.default)(ClearAction)).call(this, _Enums.ActionEnum.clear, null, ops));
    }

    return ClearAction;
}(Action);

actionIndex[_Enums.ActionEnum.clear] = ClearAction;

/**
 * 重绘action
 * */

var ReDrawAction = exports.ReDrawAction = function (_Action7) {
    (0, _inherits3.default)(ReDrawAction, _Action7);

    function ReDrawAction(shapeId, state, ops) {
        (0, _classCallCheck3.default)(this, ReDrawAction);
        return (0, _possibleConstructorReturn3.default)(this, (ReDrawAction.__proto__ || (0, _getPrototypeOf2.default)(ReDrawAction)).call(this, _Enums.ActionEnum.redraw, {
            id: shapeId,
            state: state
        }, ops));
    }

    return ReDrawAction;
}(Action);

actionIndex[_Enums.ActionEnum.redraw] = ReDrawAction;

/**
 * 移动action
 */

var MoveAction = exports.MoveAction = function (_Action8) {
    (0, _inherits3.default)(MoveAction, _Action8);

    /**
     * @constructor
     * @param {string} shapeId - 需要移动的图形的id
     * @param {object} vec - 位移
     */
    function MoveAction(shapeId, vec) {
        (0, _classCallCheck3.default)(this, MoveAction);
        return (0, _possibleConstructorReturn3.default)(this, (MoveAction.__proto__ || (0, _getPrototypeOf2.default)(MoveAction)).call(this, _Enums.ActionEnum.move, {
            id: shapeId,
            vec: vec
        }));
    }

    return MoveAction;
}(Action);

actionIndex[_Enums.ActionEnum.move] = MoveAction;

//#endregion


//#region Toolbar

var Toolbar = exports.Toolbar = function (_PureComponent) {
    (0, _inherits3.default)(Toolbar, _PureComponent);

    function Toolbar() {
        (0, _classCallCheck3.default)(this, Toolbar);
        return (0, _possibleConstructorReturn3.default)(this, (Toolbar.__proto__ || (0, _getPrototypeOf2.default)(Toolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(Toolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'svg',
                (0, _extends3.default)({}, this.props.attrs, {
                    onClick: this.props.onClick,
                    style: this.props.style }),
                this.props.children
            );
        }
    }]);
    return Toolbar;
}(_react.PureComponent);

Toolbar.propTypes = {
    children: _propTypes2.default.any,
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    attrs: _propTypes2.default.object
};
Toolbar.defaultProps = {
    attrs: {
        width: 40,
        height: 40
    }
};

var DrawingToolbar = exports.DrawingToolbar = function (_PureComponent2) {
    (0, _inherits3.default)(DrawingToolbar, _PureComponent2);

    function DrawingToolbar(props) {
        (0, _classCallCheck3.default)(this, DrawingToolbar);

        var _this10 = (0, _possibleConstructorReturn3.default)(this, (DrawingToolbar.__proto__ || (0, _getPrototypeOf2.default)(DrawingToolbar)).call(this, props));

        _this10.listener = null;
        _this10.state = {
            selected: false
        };
        return _this10;
    }

    /**
     * Toolbar的handler
     * @type {{setNoneHandler: DrawingToolbar.handlers.setNoneHandler, setLineDrawHandler: DrawingToolbar.handlers.setLineDrawHandler, setCircleDrawHandler: DrawingToolbar.handlers.setCircleDrawHandler, setLinkDrawHandler: DrawingToolbar.handlers.setLinkDrawHandler, setArrowLinkDrawHandler: DrawingToolbar.handlers.setArrowLinkDrawHandler, setTextCircleDrawHandler: DrawingToolbar.handlers.setTextCircleDrawHandler, setMoveHandler: DrawingToolbar.handlers.setMoveHandler}}
     */


    (0, _createClass3.default)(DrawingToolbar, [{
        key: 'render',
        value: function render() {
            var _this11 = this;

            return _react2.default.createElement(
                Toolbar,
                {
                    style: (0, _assign2.default)({ cursor: "pointer" }, this.props.style, this.state.selected ? { backgroundColor: "#D6D6D6" } : {}),
                    type: this.props.type,
                    attrs: this.props.attrs,
                    onClick: function onClick() {
                        var _props;

                        emitter.emit(EVENT_TOOLBAR_CHANGE, _this11.props.type);
                        _this11.props.onClick && (_props = _this11.props).onClick.apply(_props, arguments);
                    } },
                this.props.children
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this12 = this;

            this.listener = emitter.addListener(EVENT_TOOLBAR_CHANGE, function (type) {
                _this12.setState({
                    selected: type === _this12.props.type
                });
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.listener) {
                this.listener.remove();
            }
        }
    }]);
    return DrawingToolbar;
}(_react.PureComponent);

DrawingToolbar.propTypes = {
    children: _propTypes2.default.any,
    onClick: _propTypes2.default.func,
    //绘制的类型:如LineDrawing
    type: _propTypes2.default.string,
    style: _propTypes2.default.object,
    attrs: _propTypes2.default.object
};

DrawingToolbar.getShapeID = function (event) {
    var ele = event.target;
    if (ele.attributes) {
        var node = ele.attributes["shape-id"];
        if (node) {
            return node.nodeValue;
        }
    }
    return null;
};

DrawingToolbar.findShape = function (graph, ele) {
    if (ele.attributes) {
        var shapeId = ele.attributes["shape-id"] ? ele.attributes["shape-id"].value : null;
        if (shapeId) {
            return graph.findShapeById(shapeId);
        }
    }
    return null;
};

DrawingToolbar.handlers = {
    /**
     * 移除到画布的所有操作
     * @param graph
     */
    setNoneHandler: function setNoneHandler(graph) {
        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("click", function () {
            var target = d3.event.target;
            if (target) {
                if (target.attributes) {
                    var shapeId = target.attributes["shape-id"] ? target.attributes["shape-id"].value : null;
                    if (shapeId) {
                        var shape = graph.findShapeById(shapeId);
                        if (shape) {
                            shape.select();
                        }
                    }
                }
            }
        });
    },
    /**
     * 画线
     * @param graph
     */
    setLineDrawHandler: function setLineDrawHandler(graph) {
        var _this30 = this;

        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("mousedown", function () {
            var point = {
                x: graph.toLocalX(d3.event.offsetX),
                y: graph.toLocalY(d3.event.offsetY)
            };
            var drawing = new _LineDrawing2.default({
                attrs: {
                    x1: point.x,
                    y1: point.y,
                    x2: point.x,
                    y2: point.y
                }
            });
            _this30._id = drawing.id;
            graph.doActionsAsync([new DrawAction(drawing)]);
        }).on("mousemove", function () {
            if (_this30._id) {
                var point = {
                    x: graph.toLocalX(d3.event.offsetX),
                    y: graph.toLocalY(d3.event.offsetY)
                };
                graph.doActionsAsync([new ReDrawAction(_this30._id, {
                    attrs: {
                        x2: point.x,
                        y2: point.y
                    }
                })]);
            }
        }).on("mouseup", function () {
            delete _this30._id;
        });
    },
    /**
     * 画圈
     * @param graph
     */
    setCircleDrawHandler: function setCircleDrawHandler(graph) {
        var _this31 = this;

        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("mousedown", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            var point, drawing;
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            point = {
                                x: graph.toLocalX(d3.event.offsetX),
                                y: graph.toLocalY(d3.event.offsetY)
                            };
                            drawing = new _CircleDrawing2.default({
                                attrs: {
                                    cx: point.x,
                                    cy: point.y
                                }
                            });
                            _context9.next = 4;
                            return graph.doActionsAsync([new DrawAction(drawing)]);

                        case 4:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, _this31);
        })));
    },
    /**
     * 画link
     * @param graph
     */
    setLinkDrawHandler: function setLinkDrawHandler(graph) {
        var _this32 = this;

        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("mousedown", function () {
            var event = d3.event;
            _this32._sourceID = DrawingToolbar.getShapeID(event);
        }).on("mouseup", function () {
            var event = d3.event;
            var targetID = DrawingToolbar.getShapeID(event);
            if (_this32._sourceID && targetID) {
                graph.doActionsAsync([new DrawAction(new _LinkDrawing2.default({
                    sourceId: _this32._sourceID,
                    targetId: targetID
                }))]);
            }
            delete _this32._sourceID;
        });
    },
    /**
     * 画带箭头的link
     * @param graph
     */
    setArrowLinkDrawHandler: function setArrowLinkDrawHandler(graph) {
        var _this33 = this;

        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("mousedown", function () {
            var event = d3.event;
            _this33._sourceID = DrawingToolbar.getShapeID(event);
        }).on("mouseup", function () {
            var event = d3.event;
            var targetID = DrawingToolbar.getShapeID(event);
            if (_this33._sourceID && targetID) {
                graph.doActionsAsync([new DrawAction(new ArrowLinkDrawing({
                    sourceId: _this33._sourceID,
                    targetId: targetID
                }))]);
            }
            delete _this33._sourceID;
        });
    },
    /**
     * 画带圈的文本
     * @param graph
     */
    setTextCircleDrawHandler: function setTextCircleDrawHandler(graph) {
        var _this34 = this;

        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("mousedown", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
            var point, drawing;
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            point = {
                                x: graph.toLocalX(d3.event.offsetX),
                                y: graph.toLocalY(d3.event.offsetY)
                            };
                            drawing = new TextCircleDrawing({
                                circleAttrs: {
                                    cx: point.x,
                                    cy: point.y
                                },
                                text: "A"
                            });
                            _context10.next = 4;
                            return graph.doActionsAsync([new DrawAction(drawing)]);

                        case 4:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, _this34);
        })));
    },
    /**
     * 移动
     * @param graph
     */
    setMoveHandler: function setMoveHandler(graph) {
        var _this35 = this;

        graph.removeAllSvgEvent();
        var svg = d3.select(graph.ele);
        svg.on("mousedown", function () {
            var target = d3.event.target;
            if (target) {
                var shape = DrawingToolbar.findShape(graph, target);
                if (shape) {
                    _this35._mouseDownPoint = {
                        x: graph.toLocalX(d3.event.offsetX),
                        y: graph.toLocalY(d3.event.offsetY)
                    };
                    _this35._shape = shape;
                }
            }
        }).on("mousemove", function () {
            if (_this35._mouseDownPoint) {
                var point = {
                    x: graph.toLocalX(d3.event.offsetX),
                    y: graph.toLocalY(d3.event.offsetY)
                };
                var vec = {
                    x: point.x - _this35._mouseDownPoint.x,
                    y: point.y - _this35._mouseDownPoint.y
                };
                _this35._mouseDownPoint = point;
                if (_this35._shape) {
                    _this35._shape.moveTo(vec);
                }
            }
        }).on("mouseup", function () {
            if (_this35._mouseDownPoint) {
                var vec = {
                    x: graph.toLocalX(d3.event.offsetX) - _this35._mouseDownPoint.x,
                    y: graph.toLocalY(d3.event.offsetY) - _this35._mouseDownPoint.y
                };
                delete _this35._mouseDownPoint;
                if (_this35._shape) {
                    _this35._shape.moveTo(vec);
                    delete _this35._shape;
                }
            }
        });
    }
};

var NoneToolbar = exports.NoneToolbar = function (_PureComponent3) {
    (0, _inherits3.default)(NoneToolbar, _PureComponent3);

    function NoneToolbar() {
        (0, _classCallCheck3.default)(this, NoneToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (NoneToolbar.__proto__ || (0, _getPrototypeOf2.default)(NoneToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(NoneToolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    attrs: (0, _extends3.default)({}, Toolbar.defaultProps.attrs, {
                        viewBox: "0 0 512.001 512.001"
                    }),
                    onClick: DrawingToolbar.handlers.setNoneHandler.bind(this, this.props.graph),
                    type: this.type },
                _react2.default.createElement('path', {
                    style: { transform: "scale(0.5)", transformOrigin: "center" },
                    d: 'M429.742,319.31L82.49,0l-0.231,471.744l105.375-100.826l61.89,141.083l96.559-42.358l-61.89-141.083L429.742,319.31z M306.563,454.222l-41.62,18.259l-67.066-152.879l-85.589,81.894l0.164-333.193l245.264,225.529l-118.219,7.512L306.563,454.222z' })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "";
        }
    }]);
    return NoneToolbar;
}(_react.PureComponent);

NoneToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var LineToolbar = exports.LineToolbar = function (_PureComponent4) {
    (0, _inherits3.default)(LineToolbar, _PureComponent4);

    function LineToolbar() {
        (0, _classCallCheck3.default)(this, LineToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (LineToolbar.__proto__ || (0, _getPrototypeOf2.default)(LineToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(LineToolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: DrawingToolbar.handlers.setLineDrawHandler.bind(this, this.props.graph),
                    type: this.type },
                _react2.default.createElement('line', { x1: 10, y1: 10, x2: 30, y2: 30, stroke: "#888888" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "LineDrawing";
        }
    }]);
    return LineToolbar;
}(_react.PureComponent);

LineToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var CircleToolbar = exports.CircleToolbar = function (_PureComponent5) {
    (0, _inherits3.default)(CircleToolbar, _PureComponent5);

    function CircleToolbar() {
        (0, _classCallCheck3.default)(this, CircleToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (CircleToolbar.__proto__ || (0, _getPrototypeOf2.default)(CircleToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(CircleToolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: DrawingToolbar.handlers.setCircleDrawHandler.bind(this, this.props.graph),
                    type: this.type },
                _react2.default.createElement('circle', { cx: 20, cy: 20, r: 8, stroke: "#888888", fill: "#888888" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "CircleDrawing";
        }
    }]);
    return CircleToolbar;
}(_react.PureComponent);

CircleToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var LinkToolbar = exports.LinkToolbar = function (_PureComponent6) {
    (0, _inherits3.default)(LinkToolbar, _PureComponent6);

    function LinkToolbar() {
        (0, _classCallCheck3.default)(this, LinkToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (LinkToolbar.__proto__ || (0, _getPrototypeOf2.default)(LinkToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(LinkToolbar, [{
        key: 'render',


        // getShapeID(event) {
        //     const {path} = event;
        //     for (let i = 0; i < path.length; i++) {
        //         const ele = path[i];
        //         console.dir(ele)
        //         if (ele && ele.attributes) {
        //             const node = ele.attributes["shape-id"];
        //             if (node) {
        //                 return node.nodeValue;
        //             }
        //         }
        //     }
        //     return null
        // }

        value: function render() {
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: DrawingToolbar.handlers.setLinkDrawHandler.bind(this, this.props.graph),
                    type: this.type },
                _react2.default.createElement('circle', { cx: 10, cy: 10, r: 2, stroke: "#888888", fill: "#888888" }),
                _react2.default.createElement('circle', { cx: 30, cy: 30, r: 2, stroke: "#888888", fill: "#888888" }),
                _react2.default.createElement('path', { d: 'M 10 10 S 20 10, 20 20 S 20 30, 30 30', stroke: "#888888", fill: "transparent" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "LinkDrawing";
        }
    }]);
    return LinkToolbar;
}(_react.PureComponent);

LinkToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var ArrowLinkToolbar = exports.ArrowLinkToolbar = function (_PureComponent7) {
    (0, _inherits3.default)(ArrowLinkToolbar, _PureComponent7);

    function ArrowLinkToolbar() {
        (0, _classCallCheck3.default)(this, ArrowLinkToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (ArrowLinkToolbar.__proto__ || (0, _getPrototypeOf2.default)(ArrowLinkToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(ArrowLinkToolbar, [{
        key: 'render',
        value: function render() {
            var arrowPoint = getArrowPoints({ x: 20, y: 25 }, { x: 30, y: 30 }, 5);
            var arrowPath = arrowPoint.map(function (p, i) {
                if (i === 0) {
                    return 'M ' + p.x + ' ' + p.y;
                }
                return 'L ' + p.x + ' ' + p.y;
            });
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: DrawingToolbar.handlers.setArrowLinkDrawHandler.bind(this, this.props.graph),
                    type: this.type },
                _react2.default.createElement('path', { d: 'M 10 10 S 20 15, 20 20 S 20 25, 30 30', stroke: "#888888", fill: "transparent" }),
                _react2.default.createElement('path', { d: [].concat((0, _toConsumableArray3.default)(arrowPath), ["Z"]).join(" "), stroke: "#888888", fill: "#888888" })
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "ArrowLinkDrawing";
        }
    }]);
    return ArrowLinkToolbar;
}(_react.PureComponent);

ArrowLinkToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var TextCircleToolbar = exports.TextCircleToolbar = function (_PureComponent8) {
    (0, _inherits3.default)(TextCircleToolbar, _PureComponent8);

    function TextCircleToolbar() {
        (0, _classCallCheck3.default)(this, TextCircleToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (TextCircleToolbar.__proto__ || (0, _getPrototypeOf2.default)(TextCircleToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(TextCircleToolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: DrawingToolbar.handlers.setTextCircleDrawHandler.bind(this, this.props.graph),
                    type: this.type },
                _react2.default.createElement('circle', { cx: 20, cy: 20, r: 14, stroke: "black", fill: "transparent" }),
                _react2.default.createElement(
                    'text',
                    { x: 20, y: 20, fill: "black", style: { fontSize: 12 }, textAnchor: "middle",
                        dominantBaseline: "middle" },
                    'A'
                )
            );
        }
    }, {
        key: 'type',
        get: function get() {
            return "TextCircleDrawing";
        }
    }]);
    return TextCircleToolbar;
}(_react.PureComponent);

TextCircleToolbar.propTypes = {
    onClick: _propTypes2.default.func,
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var MoveToolbar = exports.MoveToolbar = function (_PureComponent9) {
    (0, _inherits3.default)(MoveToolbar, _PureComponent9);

    function MoveToolbar() {
        (0, _classCallCheck3.default)(this, MoveToolbar);
        return (0, _possibleConstructorReturn3.default)(this, (MoveToolbar.__proto__ || (0, _getPrototypeOf2.default)(MoveToolbar)).apply(this, arguments));
    }

    (0, _createClass3.default)(MoveToolbar, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                DrawingToolbar,
                { style: this.props.style,
                    onClick: DrawingToolbar.handlers.setMoveHandler.bind(this, this.props.graph),
                    attrs: (0, _extends3.default)({}, Toolbar.defaultProps.attrs, {
                        viewBox: "0 0 32 32"
                    }) },
                _react2.default.createElement(
                    'g',
                    { transform: 'translate(20,20) scale(0.5,0.5) translate(-20,-20)' },
                    _react2.default.createElement('polygon', { points: '18,20 18,26 22,26 16,32 10,26 14,26 14,20', fill: '#4E4E50' }),
                    _react2.default.createElement('polygon', { points: '14,12 14,6 10,6 16,0 22,6 18,6 18,12', fill: '#4E4E50' }),
                    _react2.default.createElement('polygon', { points: '12,18 6,18 6,22 0,16 6,10 6,14 12,14', fill: '#4E4E50' }),
                    _react2.default.createElement('polygon', { points: '20,14 26,14 26,10 32,16 26,22 26,18 20,18', fill: '#4E4E50' })
                )
            );
        }
    }]);
    return MoveToolbar;
}(_react.PureComponent);

//#endregion

//#region D3Graph
/**
 * 运筹学图形D3
 * */


MoveToolbar.propTypes = {
    style: _propTypes2.default.object,
    graph: _propTypes2.default.object.isRequired
};

var D3Graph = function (_Component) {
    (0, _inherits3.default)(D3Graph, _Component);
    (0, _createClass3.default)(D3Graph, [{
        key: 'scale',

        /**
         * @property {object} attrs - svg的属性
         * @property {Array} actions - 所有的操作
         * @property {single|multiple} selectMode [single] - 选择模式,是多选还是单选
         * @property {object} original - 坐标原点(屏幕坐标),默认值{x:0,y:0}
         * @property {screen|math} coordinateType [screen] - 坐标系,默认值是屏幕坐标系
         * @property {none|playing} mode - 模式,默认是:none,如果是playing,则是样式模式,会一步一步的演示绘图过程
         * @property {Function} renderToolbar - 绘图的工具栏
         * @property {?Number} scale [1] - 缩放比例,默认是1(1个单位对应一个像素)
         * @property {?Number} interval [1] - action的执行时间间隔
         * @property {?Function} onAction [null] - action的回调函数,函数包含一个参数 action
         * */
        get: function get() {
            return this.state.scale;
        }
    }]);

    function D3Graph(props) {
        (0, _classCallCheck3.default)(this, D3Graph);

        var _this20 = (0, _possibleConstructorReturn3.default)(this, (D3Graph.__proto__ || (0, _getPrototypeOf2.default)(D3Graph)).call(this, props));

        _this20.ele = null;
        //画布中已有的图形
        _this20.shapes = [];
        //已经选中的图形的id
        _this20.selectedShapes = [];
        //绘制类型
        // this.definedDrawing = Object.assign({}, builtinDefinedDrawing, this.props.customDefinedDrawing);
        _this20.playingTimer = null;
        //播放的索引
        _this20.playingIndex = 0;
        //正在播放的action
        _this20.playingActions = [];
        //播放选项
        _this20.playingOption = null;
        //执行action的timter
        _this20.timer = null;
        _this20.state = {
            //inputAction的属性
            inputProperties: [],
            //是否显示用户输入
            showUserInput: false,
            //所有的action
            actions: [],
            //action执行的时间间隔
            interval: props.interval,
            //比例尺
            scale: props.scale,
            //原点
            original: props.original,
            //坐标系类型
            coordinateType: props.coordinateType,
            attrs: props.attrs
        };
        return _this20;
    }

    /**
     * 根据id查找对应的图形
     * @private
     * */


    (0, _createClass3.default)(D3Graph, [{
        key: 'findShapeById',
        value: function findShapeById(id) {
            var index = this.shapes.findIndex(function (f) {
                return f.id === id;
            });
            return this.shapes[index];
        }
    }, {
        key: 'getSelectedShapes',
        value: function getSelectedShapes() {
            return this.selectedShapes;
        }

        /**
         * 将输入的坐标转换成屏幕坐标
         * @property {number} value - 如果坐标是屏幕坐标系就输入屏幕坐标,如果是数学坐标系就输入数学坐标
         * @private
         * */

    }, {
        key: 'toScreenX',
        value: function toScreenX(value) {
            return this.state.original.x + parseFloat(value) * this.state.scale;
        }

        /**
         * 将输入的坐标转成屏幕坐标
         * @property {number} value - 如果坐标是屏幕坐标系就输入屏幕坐标,如果是数学坐标系就输入数学坐标
         * @private
         * */

    }, {
        key: 'toScreenY',
        value: function toScreenY(value) {
            if (this.state.coordinateType === _Enums.CoordinateEnum.screen) {
                return this.state.original.y + parseFloat(value) * this.state.scale;
            }
            return this.state.original.y - parseFloat(value) * this.state.scale;
        }

        /**
         * 将屏幕坐标转换成图形对应的坐标
         * @private
         * @param screenX
         * @return {number}
         */

    }, {
        key: 'toLocalX',
        value: function toLocalX(screenX) {
            if (this.state.coordinateType === _Enums.CoordinateEnum.math) {
                return (screenX - this.state.original.x) / this.state.scale;
            }
            return screenX / this.state.scale;
        }

        /**
         * 将屏幕坐标转换成图形对应的坐标
         * @private
         * @param screenY
         * @return {number}
         */

    }, {
        key: 'toLocalY',
        value: function toLocalY(screenY) {
            if (this.state.coordinateType === _Enums.CoordinateEnum.math) {
                return (this.state.original.y - screenY) / this.state.scale;
            }
            return screenY / this.state.scale;
        }
    }, {
        key: 'doActionsAsync',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(actions) {
                var _this21 = this;

                var action;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                action = actions.shift();

                                if (!action) {
                                    _context2.next = 5;
                                    break;
                                }

                                _context2.next = 4;
                                return this.doActionAsync(action);

                            case 4:
                                if (!action.canBreak) {
                                    //next
                                    this.timer = setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this21.doActionsAsync(actions);

                                                    case 2:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this21);
                                    })), action.nextInterval ? action.nextInterval : this.state.interval);
                                } else {
                                    //保存后续的action,等待继续执行
                                    this._leftActions = actions;
                                }

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function doActionsAsync(_x2) {
                return _ref.apply(this, arguments);
            }

            return doActionsAsync;
        }()
    }, {
        key: 'doActionAsync',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(action) {
                var _this22 = this;

                var index, key, id, shape, _id, _shape, _id2, _shape2, _shape3;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.t0 = action.type;
                                _context5.next = _context5.t0 === _Enums.ActionEnum.draw ? 3 : _context5.t0 === _Enums.ActionEnum.redraw ? 6 : _context5.t0 === _Enums.ActionEnum.select ? 22 : _context5.t0 === _Enums.ActionEnum.unselect ? 33 : _context5.t0 === _Enums.ActionEnum.delete ? 39 : _context5.t0 === _Enums.ActionEnum.clear ? 44 : _context5.t0 === _Enums.ActionEnum.input ? 47 : _context5.t0 === _Enums.ActionEnum.move ? 50 : 53;
                                break;

                            case 3:
                                this.shapes.push(action.params);
                                this.drawShapes([action.params]);
                                return _context5.abrupt('break', 53);

                            case 6:
                                index = this.shapes.findIndex(function (f) {
                                    return f.id === action.params.id;
                                });

                                if (!(index >= 0)) {
                                    _context5.next = 21;
                                    break;
                                }

                                if (!action.params.state) {
                                    _context5.next = 20;
                                    break;
                                }

                                _context5.t1 = _regenerator2.default.keys(action.params.state);

                            case 10:
                                if ((_context5.t2 = _context5.t1()).done) {
                                    _context5.next = 20;
                                    break;
                                }

                                key = _context5.t2.value;
                                _context5.t3 = Object.prototype.toString.call(this.shapes[index][key]);
                                _context5.next = _context5.t3 === "[object Object]" ? 15 : 17;
                                break;

                            case 15:
                                this.shapes[index][key] = (0, _assign2.default)({}, this.shapes[index][key], action.params.state[key]);
                                // state[key] = {$set: };
                                return _context5.abrupt('break', 18);

                            case 17:
                                this.shapes[index][key] = action.params.state[key];

                            case 18:
                                _context5.next = 10;
                                break;

                            case 20:
                                this.drawShapes([this.shapes[index]]);

                            case 21:
                                return _context5.abrupt('break', 53);

                            case 22:
                                id = action.params;
                                shape = this.findShapeById(id);

                                if (!shape.selected) {
                                    _context5.next = 29;
                                    break;
                                }

                                _context5.next = 27;
                                return this.doActionAsync(new UnSelectAction(id));

                            case 27:
                                _context5.next = 31;
                                break;

                            case 29:
                                shape.selected = true;
                                if (this.props.selectMode === _Enums.SelectModeEnum.single) {
                                    //将已选中的shape取消选中
                                    this.selectedShapes.map(function (f) {
                                        return f.id;
                                    }).forEach(function () {
                                        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(i) {
                                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                    switch (_context3.prev = _context3.next) {
                                                        case 0:
                                                            _context3.next = 2;
                                                            return _this22.doActionAsync(new UnSelectAction(i));

                                                        case 2:
                                                        case 'end':
                                                            return _context3.stop();
                                                    }
                                                }
                                            }, _callee3, _this22);
                                        }));

                                        return function (_x4) {
                                            return _ref4.apply(this, arguments);
                                        };
                                    }());
                                    this.selectedShapes = [shape];
                                } else {
                                    this.selectedShapes.push(shape);
                                }

                            case 31:
                                this.drawShapes([shape]);
                                return _context5.abrupt('break', 53);

                            case 33:
                                _id = action.params;
                                _shape = this.findShapeById(_id);

                                _shape.selected = false;
                                this.selectedShapes = this.selectedShapes.filter(function (f) {
                                    return f.id !== _id;
                                });
                                this.drawShapes([_shape]);
                                return _context5.abrupt('break', 53);

                            case 39:
                                _id2 = action.params;
                                //删除的图形

                                _shape2 = this.shapes.find(function (s) {
                                    return s.id === _id2;
                                });
                                //删除后的图形

                                this.shapes = this.shapes.filter(function (s) {
                                    return s.id !== _id2;
                                });
                                // if (shape.selection) {
                                //     shape.selection.remove();
                                //     delete shape.selection;
                                // }
                                if (_shape2) {
                                    _shape2.remove();
                                }
                                return _context5.abrupt('break', 53);

                            case 44:
                                this.shapes.forEach(function () {
                                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(shape) {
                                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        _context4.next = 2;
                                                        return _this22.doActionAsync(new DeleteAction(shape.id));

                                                    case 2:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this22);
                                    }));

                                    return function (_x5) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());
                                this.selectedShapes = [];
                                return _context5.abrupt('break', 53);

                            case 47:
                                _context5.next = 49;
                                return this.showUserInputPromise(action);

                            case 49:
                                return _context5.abrupt('break', 53);

                            case 50:
                                _shape3 = this.shapes.find(function (f) {
                                    return f.id === action.params.id;
                                });

                                if (_shape3) {
                                    _shape3.moveTo(action.params.vec);
                                }
                                return _context5.abrupt('break', 53);

                            case 53:
                                this.setState((0, _immutabilityHelper2.default)(this.state, {
                                    actions: { $push: [action] }
                                }), function () {
                                    if (_this22.props.onAction) {
                                        _this22.props.onAction(action);
                                    }
                                });

                            case 54:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function doActionAsync(_x3) {
                return _ref3.apply(this, arguments);
            }

            return doActionAsync;
        }()

        /**
         * 显示用户输入
         * @private
         * @param action
         */

    }, {
        key: 'showUserInputPromise',
        value: function showUserInputPromise(action) {
            var _this23 = this;

            return new _promise2.default(function (resolve) {
                _this23.setState({
                    showUserInput: true,
                    inputProperties: action.params
                }, function () {
                    resolve();
                });
            });
        }

        /**
         * 隐藏用户输入并执行下一个action
         * @private
         */

    }, {
        key: 'hideUserInput',
        value: function hideUserInput(nextActionOption) {
            var _this24 = this;

            var params = this.state.inputProperties.map(function (property) {
                return {
                    path: property.fieldName,
                    value: (0, _objectPath.get)(nextActionOption, property.fieldName)
                };
            });
            this.setState({
                showUserInput: false,
                inputProperties: []
            }, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                //执行下一个action
                                if (_this24._leftActions.length > 0) {
                                    params.forEach(function (p) {
                                        (0, _objectPath.set)(_this24._leftActions[0].params, p.path, p.value);
                                    });
                                }
                                _context6.next = 3;
                                return _this24.doActionsAsync(_this24._leftActions);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, _this24);
            })));
        }
    }, {
        key: 'drawShapes',
        value: function drawShapes(shapes) {
            var _this25 = this;

            shapes.forEach(function (shape) {
                //初始化
                if (!shape.ready) {
                    shape.initialize(_this25);
                }
                shape.render();
            });
        }

        /**
         * 获取图形数据
         *
         * @deprecated 请使用`getDrawingActions`代替
         * @return {*[]}
         */

    }, {
        key: 'getDrawingData',
        value: function getDrawingData() {
            var _this26 = this;

            console.warn('getDrawingData \u65B9\u6CD5\u5C06\u5728\u4E0B\u4E00\u4E2A\u7248\u672C\u5220\u9664\u6389,\u8BF7\u4F7F\u7528 getDrawingActions \u4EE3\u66FF');
            var actions = this.state.actions.filter(function (f) {
                return f.type === _Enums.ActionEnum.draw;
            });
            return actions.map(function (item) {
                var shape = _this26.findShapeById(item.params.id);
                return {
                    type: item.type,
                    params: shape && shape.toData ? [shape.toData()] : [item.params.toData()]
                };
            });
        }

        /**
         * 获取所有绘图的action
         * @return {*[]}
         */

    }, {
        key: 'getDrawingActions',
        value: function getDrawingActions() {
            var _this27 = this;

            var actions = this.state.actions.filter(function (f) {
                return f.type === _Enums.ActionEnum.draw;
            });
            return actions.map(function (item) {
                var shape = _this27.findShapeById(item.params.id);
                return {
                    type: item.type,
                    params: shape && shape.toData ? [shape.toData()] : [item.params.toData()]
                };
            });
        }

        /**
         * 清除画布,这个方法除了会把画布上的内容清除以外还会重置内部的action状态
         */

    }, {
        key: 'clear',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.doActionAsync(new ClearAction());

                            case 2:
                                this.setState({
                                    actions: []
                                });

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function clear() {
                return _ref7.apply(this, arguments);
            }

            return clear;
        }()
    }, {
        key: 'play',
        value: function play(actions, playingOps) {
            this.playingActions = actions;
            this.playingIndex = 0;
            this.playingOption = playingOps;
            // let actionIndex = 0;
            // const next = () => {
            //     if (actionIndex >= actions.length) {
            //         return;
            //     }
            //     const action = actions[actionIndex];
            //     /**
            //      * 如果action允许中断操作则停止play
            //      */
            //     if (action.canBreak) {
            //         return;
            //     }
            //     this.doActions([action]);
            //     actionIndex++;
            //     this.playingTimer = setTimeout(next.bind(this), action.nextInterval ? action.nextInterval : getPath(playingOps, "interval", 1000));
            // }
            // next();
            this.playNextAction();
        }

        /**
         * 执行下一个下一个action
         * @private
         */

    }, {
        key: 'playNextAction',
        value: function playNextAction() {
            if (this.playingIndex >= this.playingActions.length) {
                return;
            }
            var action = this.playingActions[this.playingIndex];
            this.doActionsAsync([action]);
            if (action.canBreak) {
                return;
            }
            this.playingIndex++;
            this.playingTimer = setTimeout(this.playNextAction.bind(this), action.nextInterval ? action.nextInterval : (0, _objectPath.get)(this.playingOption, "interval", 1000));
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.playingTimer) {
                clearTimeout(this.playingTimer);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this28 = this;

            return _react2.default.createElement(
                _WorkSpace2.default,
                { actions: this.props.renderToolbar(this) },
                _react2.default.createElement('svg', (0, _extends3.default)({ ref: function ref(_ref8) {
                        return _this28.ele = _ref8;
                    } }, this.state.attrs)),
                this.state.showUserInput && _react2.default.createElement(_UserInput2.default, { properties: this.state.inputProperties,
                    onOK: function onOK(value) {
                        //执行下一个action,并把用户的输入参数参入到下一个action
                        _this28.hideUserInput(value);
                    } })
            );
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this29 = this;

            var newState = {};
            if (nextProps.attrs) {
                newState.attrs = nextProps.attrs;
            }
            if (nextProps.coordinateType !== this.state.coordinateType) {
                newState.coordinateType = nextProps.coordinateType;
            }
            if (this.state.interval !== nextProps.interval) {
                newState.interval = nextProps.interval;
            }
            if (this.state.scale !== nextProps.scale) {
                newState.scale = nextProps.scale;
            }
            if (this.state.original.x !== nextProps.original.x || this.state.original.y !== nextProps.original.y) {
                newState.original = nextProps.original;
            }
            var doActions = function doActions() {
                if (nextProps.actions.length > 0) {
                    _this29.doActionsAsync(nextProps.actions);
                }
            };
            var keys = (0, _keys2.default)(newState);
            if (keys.length > 0) {
                this.setState(newState, doActions);
            } else {
                doActions();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.doActionsAsync(this.props.actions);

                            case 2:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function componentDidMount() {
                return _ref9.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
        }
    }, {
        key: 'removeAllSvgEvent',
        value: function removeAllSvgEvent() {
            var svg = d3.select(this.ele);
            svg.on("click", null).on("mousedown", null).on("mousemove", null).on("mouseup", null);
        }
    }]);
    return D3Graph;
}(_react.Component);
//#endregion


D3Graph.propTypes = {
    attrs: _propTypes2.default.object,
    //action
    actions: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        type: _propTypes2.default.oneOf((0, _keys2.default)(_Enums.ActionEnum)).isRequired,
        params: _propTypes2.default.any
    })),
    // //默认的图形的样式
    // defaultAttrs: PropTypes.shape({
    // 	line: PropTypes.object,
    // 	dot: PropTypes.object,
    // 	circle: PropTypes.object,
    // 	text: PropTypes.object
    // }),
    // //图形被选中时候的样式
    // selectedAttrs: PropTypes.shape({
    // 	line: PropTypes.object,
    // 	dot: PropTypes.object,
    // }),
    //选择模式,是多选还是单选
    selectMode: _propTypes2.default.oneOf((0, _keys2.default)(_Enums.SelectModeEnum)),
    //自定义绘制类型
    // customDefinedDrawing: PropTypes.object,
    // onDrawTypeChange: PropTypes.func,
    original: _propTypes2.default.shape({
        x: _propTypes2.default.number,
        y: _propTypes2.default.number
    }),
    coordinateType: _propTypes2.default.oneOf((0, _keys2.default)(_Enums.CoordinateEnum)),
    mode: _propTypes2.default.oneOf((0, _keys2.default)(_Enums.GraphEnum)),
    playingOption: _propTypes2.default.shape({
        interval: _propTypes2.default.number
    }),
    renderToolbar: _propTypes2.default.func,
    scale: _propTypes2.default.number,
    interval: _propTypes2.default.number,
    onAction: _propTypes2.default.func
};
D3Graph.defaultProps = {
    attrs: {
        width: 400,
        height: 300,
        viewBox: "0 0 400 300",
        style: {
            backgroundColor: "#cccccc"
        }
    },
    selectMode: _Enums.SelectModeEnum.single,
    actions: [],
    original: {
        x: 0,
        y: 0
    },
    coordinateType: _Enums.CoordinateEnum.screen,
    mode: _Enums.GraphEnum.none,
    renderToolbar: function renderToolbar() {
        return null;
    },
    scale: 1,
    interval: 1,
    onAction: null
};
exports.default = D3Graph;