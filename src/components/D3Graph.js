/**
 * @todo 实现用户的输入action,输入action是一个中断操作
 * 实现link,arrowLink的label
 * 实现图的drawing
 * @todo 实现transition
 * @todo 实现data action
 *
 * */

import React, {Component, PureComponent} from "react";
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import WorkSpace from './WorkSpace'
import {get as getPath, set as setPath} from 'object-path'
import update from 'immutability-helper'
import {EventEmitter} from 'fbemitter'
import UserInput from "./UserInput"
import LinkDrawing from "./drawing/LinkDrawing"
import LineDrawing from "./drawing/LineDrawing"
import CircleDrawing from "./drawing/CircleDrawing"
import DrawingDefinition from "./drawing/index"
import {ActionEnum, CoordinateEnum, GraphEnum, SelectModeEnum} from "./Enums";
import type {ActionType, DrawingType} from "./Types";

//#region event
const emitter = new EventEmitter();
//toolbar 按钮切换
const EVENT_TOOLBAR_CHANGE = "EVENT_TOOLBAR_CHANGE";
//图形的位置发生变化
const EVENT_DRAWING_POSITION_CHANGE = "EVENT_DRAWING_POSITION_CHANGE";
//#endregion


let actionIndex = {};

/**
 * 注册Drawing绘制类
 * @param {String} name - name值必须和绘图类的类名保持一致
 * @param {Function} drawing - 绘图类
 * */

function getArrowPoints(startPoint, endPoint, distance = 5) {
    const diffX = startPoint.x - endPoint.x;
    const diffY = startPoint.y - endPoint.y;
    const a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    const q1x = endPoint.x + (distance * (diffX + diffY)) / a
    const q1y = endPoint.y + (distance * (diffY - diffX)) / a
    const q3x = endPoint.x + (distance * (diffX - diffY)) / a;
    const q3y = endPoint.y + (distance * (diffX + diffY)) / a;
    return [
        new Point(endPoint.x, endPoint.y),
        new Point(q1x, q1y),
        new Point(q3x, q3y)
    ];
}


/**
 * 反序列化drawing
 * */
export function fromDrawing(drawingOps: DrawingType) {
    const func = DrawingDefinition[drawingOps.type];
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
export function fromActions(actions: Array<ActionType>) {
    return actions.map(action => {
        const type = action.type;
        const args = action.params || [];
        const ops = action.ops;
        const func = actionIndex[type];
        if (!func) {
            throw new Error(`action ${type} is not defined`);
        }
        switch (type) {
            case ActionEnum.draw:
                return new func(...args.map(arg => fromDrawing(arg), ops));
            default:
                return new func(...args, ops);
        }

    })
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//#region Action
/**
 * action基类
 * */
class Action {
    constructor(type, params, ops) {
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
        this.nextInterval = getPath(ops, "nextInterval", null);
        /**
         * 是否允许中断操作
         * @type {boolean}
         */
        this.canBreak = false;
    }

    toData() {
        return {
            type: this.type,
            params: this.params.toData ? [this.params.toData()] : this.params
        }
    }
}

/**
 * 用户输入action,中断操作
 */
export class InputAction extends Action {
    /**
     *
     * @param {Array} params
     * @param {String} params[].label
     * @param {String} params[].fieldName
     * @param {any} params[].defaultValue
     * @param {?Object} ops
     */
    constructor(params, ops) {
        super(ActionEnum.input, params, ops);
        this.canBreak = true;
    }
}

actionIndex[ActionEnum.input] = InputAction;

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
export class DrawAction extends Action {
    constructor(drawingOps, ops) {
        super(ActionEnum.draw, drawingOps, ops)
    }
}

actionIndex[ActionEnum.draw] = DrawAction;

/**
 * 选择action
 *
 * @example
 *
 * <D3Graph actions={[new SelectAction('SHAPE_ID')]}/>
 *
 * */
export class SelectAction extends Action {
    constructor(shapeId, ops) {
        super(ActionEnum.select, shapeId, ops)
    }
}

actionIndex[ActionEnum.select] = SelectAction;

/**
 * 取消选择action
 *
 * @example
 *
 * <D3Graph actions={[new UnSelectAction('SHAPE_ID')]}/>
 *
 * */
export class UnSelectAction extends Action {
    constructor(shapeId, ops) {
        super(ActionEnum.unselect, shapeId, ops)
    }
}

actionIndex[ActionEnum.unselect] = UnSelectAction;

/**
 * 删除图形action
 *
 * @example
 *
 * <D3Graph actions={[new DeleteAction('SHAPE_ID')]}/>
 *
 * */
export class DeleteAction extends Action {
    constructor(shapeId, ops) {
        super(ActionEnum.delete, shapeId, ops);
    }
}

actionIndex[ActionEnum.delete] = DeleteAction;

/**
 * 清除所有的图形action
 *
 * @example
 *
 * <D3Graph actions={[new ClearAction()]}/>
 *
 * */
export class ClearAction extends Action {
    constructor(ops) {
        super(ActionEnum.clear, null, ops);
    }
}

actionIndex[ActionEnum.clear] = ClearAction;


/**
 * 重绘action
 * */
export class ReDrawAction extends Action {
    constructor(shapeId, state, ops) {
        super(ActionEnum.redraw, {
            id: shapeId,
            state: state
        }, ops)
    }
}

actionIndex[ActionEnum.redraw] = ReDrawAction;

/**
 * 移动action
 */
export class MoveAction extends Action {
    /**
     * @constructor
     * @param {string} shapeId - 需要移动的图形的id
     * @param {object} vec - 位移
     */
    constructor(shapeId, vec) {
        super(ActionEnum.move, {
            id: shapeId,
            vec: vec
        })
    }
}

actionIndex[ActionEnum.move] = MoveAction;

//#endregion


//#region Toolbar
export class Toolbar extends PureComponent {
    static propTypes = {
        children: PropTypes.any,
        onClick: PropTypes.func,
        style: PropTypes.object,
        attrs: PropTypes.object
    };

    static defaultProps = {
        attrs: {
            width: 40,
            height: 40
        }
    };

    render() {
        return (
            <svg {...this.props.attrs}
                 onClick={this.props.onClick}
                 style={this.props.style}>
                {this.props.children}
            </svg>
        );
    }
}

export class DrawingToolbar extends PureComponent {
    static propTypes = {
        children: PropTypes.any,
        onClick: PropTypes.func,
        //绘制的类型:如LineDrawing
        type: PropTypes.string,
        style: PropTypes.object,
        attrs: PropTypes.object
    };

    static getShapeID = (event) => {
        const ele = event.target;
        if (ele.attributes) {
            const node = ele.attributes["shape-id"];
            if (node) {
                return node.nodeValue;
            }
        }
        return null
    }

    static findShape = (graph, ele) => {
        if (ele.attributes) {
            const shapeId = ele.attributes["shape-id"] ? ele.attributes["shape-id"].value : null;
            if (shapeId) {
                return graph.findShapeById(shapeId);
            }
        }
        return null;
    }

    /**
     * Toolbar的handler
     * @type {{setNoneHandler: DrawingToolbar.handlers.setNoneHandler, setLineDrawHandler: DrawingToolbar.handlers.setLineDrawHandler, setCircleDrawHandler: DrawingToolbar.handlers.setCircleDrawHandler, setLinkDrawHandler: DrawingToolbar.handlers.setLinkDrawHandler, setArrowLinkDrawHandler: DrawingToolbar.handlers.setArrowLinkDrawHandler, setTextCircleDrawHandler: DrawingToolbar.handlers.setTextCircleDrawHandler, setMoveHandler: DrawingToolbar.handlers.setMoveHandler}}
     */
    static handlers = {
        /**
         * 移除到画布的所有操作
         * @param graph
         */
        setNoneHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("click", () => {
                const target = d3.event.target;
                if (target) {
                    if (target.attributes) {
                        const shapeId = target.attributes["shape-id"] ? target.attributes["shape-id"].value : null;
                        if (shapeId) {
                            const shape = graph.findShapeById(shapeId);
                            if (shape) {
                                shape.select();
                            }
                        }
                    }
                }
            })
        },
        /**
         * 画线
         * @param graph
         */
        setLineDrawHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("mousedown", () => {
                const point = {
                    x: graph.toLocalX(d3.event.offsetX),
                    y: graph.toLocalY(d3.event.offsetY)
                };
                const drawing = new LineDrawing({
                    attrs: {
                        x1: point.x,
                        y1: point.y,
                        x2: point.x,
                        y2: point.y
                    }
                });
                this._id = drawing.id;
                graph.doActionsAsync([
                    new DrawAction(drawing)
                ])
            })
                .on("mousemove", () => {
                    if (this._id) {
                        const point = {
                            x: graph.toLocalX(d3.event.offsetX),
                            y: graph.toLocalY(d3.event.offsetY)
                        };
                        graph.doActionsAsync([
                            new ReDrawAction(this._id, {
                                attrs: {
                                    x2: point.x,
                                    y2: point.y
                                }
                            })
                        ])
                    }
                })
                .on("mouseup", () => {
                    delete this._id;
                })
        },
        /**
         * 画圈
         * @param graph
         */
        setCircleDrawHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("mousedown", async () => {
                const point = {
                    x: graph.toLocalX(d3.event.offsetX),
                    y: graph.toLocalY(d3.event.offsetY)
                };
                const drawing = new CircleDrawing({
                    attrs: {
                        cx: point.x,
                        cy: point.y
                    }
                })
                await graph.doActionsAsync([
                    new DrawAction(drawing)
                ])
            })
        },
        /**
         * 画link
         * @param graph
         */
        setLinkDrawHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("mousedown", () => {
                const event = d3.event;
                this._sourceID = DrawingToolbar.getShapeID(event);
            }).on("mouseup", () => {
                const event = d3.event;
                const targetID = DrawingToolbar.getShapeID(event);
                if (this._sourceID && targetID) {
                    graph.doActionsAsync([
                        new DrawAction(new LinkDrawing({
                            sourceId: this._sourceID,
                            targetId: targetID
                        }))
                    ])
                }
                delete this._sourceID;
            })
        },
        /**
         * 画带箭头的link
         * @param graph
         */
        setArrowLinkDrawHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("mousedown", () => {
                const event = d3.event;
                this._sourceID = DrawingToolbar.getShapeID(event);
            }).on("mouseup", () => {
                const event = d3.event;
                const targetID = DrawingToolbar.getShapeID(event);
                if (this._sourceID && targetID) {
                    graph.doActionsAsync([
                        new DrawAction(new ArrowLinkDrawing({
                            sourceId: this._sourceID,
                            targetId: targetID
                        }))
                    ])
                }
                delete this._sourceID;
            })
        },
        /**
         * 画带圈的文本
         * @param graph
         */
        setTextCircleDrawHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("mousedown", async () => {
                const point = {
                    x: graph.toLocalX(d3.event.offsetX),
                    y: graph.toLocalY(d3.event.offsetY)
                };
                const drawing = new TextCircleDrawing({
                    circleAttrs: {
                        cx: point.x,
                        cy: point.y
                    },
                    text: "A"
                })
                await graph.doActionsAsync([
                    new DrawAction(drawing)
                ])
            })
        },
        /**
         * 移动
         * @param graph
         */
        setMoveHandler: function (graph) {
            graph.removeAllSvgEvent();
            const svg = d3.select(graph.ele);
            svg.on("mousedown", () => {
                const target = d3.event.target;
                if (target) {
                    const shape = DrawingToolbar.findShape(graph, target);
                    if (shape) {
                        this._mouseDownPoint = {
                            x: graph.toLocalX(d3.event.offsetX),
                            y: graph.toLocalY(d3.event.offsetY)
                        };
                        this._shape = shape;
                    }
                }

            })
                .on("mousemove", () => {
                    if (this._mouseDownPoint) {
                        const point = {
                            x: graph.toLocalX(d3.event.offsetX),
                            y: graph.toLocalY(d3.event.offsetY)
                        };
                        const vec = {
                            x: point.x - this._mouseDownPoint.x,
                            y: point.y - this._mouseDownPoint.y
                        };
                        this._mouseDownPoint = point;
                        if (this._shape) {
                            this._shape.moveTo(vec);
                        }
                    }
                })
                .on("mouseup", () => {
                    if (this._mouseDownPoint) {
                        const vec = {
                            x: graph.toLocalX(d3.event.offsetX) - this._mouseDownPoint.x,
                            y: graph.toLocalY(d3.event.offsetY) - this._mouseDownPoint.y
                        };
                        delete this._mouseDownPoint;
                        if (this._shape) {
                            this._shape.moveTo(vec);
                            delete this._shape;
                        }
                    }
                })
        }
    };

    constructor(props) {
        super(props);
        this.listener = null;
        this.state = {
            selected: false
        };
    }

    render() {
        return (
            <Toolbar
                style={Object.assign({cursor: "pointer"}, this.props.style, this.state.selected ? {backgroundColor: "#D6D6D6"} : {})}
                type={this.props.type}
                attrs={this.props.attrs}
                onClick={(...args) => {
                    emitter.emit(EVENT_TOOLBAR_CHANGE, this.props.type);
                    this.props.onClick && this.props.onClick(...args)
                }}>
                {this.props.children}
            </Toolbar>
        );
    }

    componentDidMount() {
        this.listener = emitter.addListener(EVENT_TOOLBAR_CHANGE, (type) => {
            this.setState({
                selected: type === this.props.type
            })
        })
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }
}

export class NoneToolbar extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    get type() {
        return ""
    }

    render() {
        return (
            <DrawingToolbar style={this.props.style}
                            attrs={{
                                ...Toolbar.defaultProps.attrs,
                                viewBox: "0 0 512.001 512.001"
                            }}
                            onClick={DrawingToolbar.handlers.setNoneHandler.bind(this, this.props.graph)}
                            type={this.type}>
                <path
                    style={{transform: "scale(0.5)", transformOrigin: "center"}}
                    d="M429.742,319.31L82.49,0l-0.231,471.744l105.375-100.826l61.89,141.083l96.559-42.358l-61.89-141.083L429.742,319.31z M306.563,454.222l-41.62,18.259l-67.066-152.879l-85.589,81.894l0.164-333.193l245.264,225.529l-118.219,7.512L306.563,454.222z"/>
            </DrawingToolbar>
        );
    }
}

export class LineToolbar extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    get type() {
        return "LineDrawing"
    }

    render() {
        return (
            <DrawingToolbar style={this.props.style}
                            onClick={DrawingToolbar.handlers.setLineDrawHandler.bind(this, this.props.graph)}
                            type={this.type}>
                <line x1={10} y1={10} x2={30} y2={30} stroke={"#888888"}></line>
            </DrawingToolbar>
        );
    }
}

export class CircleToolbar extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    get type() {
        return "CircleDrawing";
    }

    render() {
        return (
            <DrawingToolbar style={this.props.style}
                            onClick={DrawingToolbar.handlers.setCircleDrawHandler.bind(this, this.props.graph)}
                            type={this.type}>
                <circle cx={20} cy={20} r={8} stroke={"#888888"} fill={"#888888"}></circle>
            </DrawingToolbar>
        );
    }
}

export class LinkToolbar extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    get type() {
        return "LinkDrawing";
    }

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

    render() {
        return (
            <DrawingToolbar style={this.props.style}
                            onClick={DrawingToolbar.handlers.setLinkDrawHandler.bind(this, this.props.graph)}
                            type={this.type}>
                <circle cx={10} cy={10} r={2} stroke={"#888888"} fill={"#888888"}></circle>
                <circle cx={30} cy={30} r={2} stroke={"#888888"} fill={"#888888"}></circle>
                <path d="M 10 10 S 20 10, 20 20 S 20 30, 30 30" stroke={"#888888"} fill={"transparent"}></path>
            </DrawingToolbar>
        );
    }
}

export class ArrowLinkToolbar extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    get type() {
        return "ArrowLinkDrawing";
    }

    render() {
        const arrowPoint = getArrowPoints({x: 20, y: 25}, {x: 30, y: 30}, 5);
        const arrowPath = arrowPoint.map((p, i) => {
            if (i === 0) {
                return `M ${p.x} ${p.y}`;
            }
            return `L ${p.x} ${p.y}`;
        });
        return (
            <DrawingToolbar style={this.props.style}
                            onClick={DrawingToolbar.handlers.setArrowLinkDrawHandler.bind(this, this.props.graph)}
                            type={this.type}>
                <path d="M 10 10 S 20 15, 20 20 S 20 25, 30 30" stroke={"#888888"} fill={"transparent"}></path>
                <path d={[...arrowPath, "Z"].join(" ")} stroke={"#888888"} fill={"#888888"}></path>
            </DrawingToolbar>
        );
    }
}

export class TextCircleToolbar extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    get type() {
        return "TextCircleDrawing";
    }

    render() {
        return (
            <DrawingToolbar style={this.props.style}
                            onClick={DrawingToolbar.handlers.setTextCircleDrawHandler.bind(this, this.props.graph)}
                            type={this.type}>
                <circle cx={20} cy={20} r={14} stroke={"black"} fill={"transparent"}></circle>
                <text x={20} y={20} fill={"black"} style={{fontSize: 12}} textAnchor={"middle"}
                      dominantBaseline={"middle"}>A
                </text>
            </DrawingToolbar>
        );
    }
}

export class MoveToolbar extends PureComponent {
    static propTypes = {
        style: PropTypes.object,
        graph: PropTypes.object.isRequired
    };

    render() {
        return (
            <DrawingToolbar style={this.props.style}
                            onClick={DrawingToolbar.handlers.setMoveHandler.bind(this, this.props.graph)}
                            attrs={{
                                ...Toolbar.defaultProps.attrs,
                                viewBox: "0 0 32 32"
                            }}>
                <g transform="translate(20,20) scale(0.5,0.5) translate(-20,-20)">
                    <polygon points="18,20 18,26 22,26 16,32 10,26 14,26 14,20" fill="#4E4E50"/>
                    <polygon points="14,12 14,6 10,6 16,0 22,6 18,6 18,12" fill="#4E4E50"/>
                    <polygon points="12,18 6,18 6,22 0,16 6,10 6,14 12,14" fill="#4E4E50"/>
                    <polygon points="20,14 26,14 26,10 32,16 26,22 26,18 20,18" fill="#4E4E50"/>
                </g>
            </DrawingToolbar>
        );
    }
}

//#endregion

//#region D3Graph
/**
 * 运筹学图形D3
 * */
export default class D3Graph extends Component {
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
    static propTypes = {
        attrs: PropTypes.object,
        //action
        actions: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.oneOf(Object.keys(ActionEnum)).isRequired,
            params: PropTypes.any
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
        selectMode: PropTypes.oneOf(Object.keys(SelectModeEnum)),
        //自定义绘制类型
        // customDefinedDrawing: PropTypes.object,
        // onDrawTypeChange: PropTypes.func,
        original: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        coordinateType: PropTypes.oneOf(Object.keys(CoordinateEnum)),
        mode: PropTypes.oneOf(Object.keys(GraphEnum)),
        playingOption: PropTypes.shape({
            interval: PropTypes.number
        }),
        renderToolbar: PropTypes.func,
        scale: PropTypes.number,
        interval: PropTypes.number,
        onAction: PropTypes.func
    };
    static defaultProps = {
        attrs: {
            width: 400,
            height: 300,
            viewBox: "0 0 400 300",
            style: {
                backgroundColor: "#cccccc"
            }
        },
        selectMode: SelectModeEnum.single,
        actions: [],
        original: {
            x: 0,
            y: 0
        },
        coordinateType: CoordinateEnum.screen,
        mode: GraphEnum.none,
        renderToolbar: () => null,
        scale: 1,
        interval: 1,
        onAction: null
    }

    get scale() {
        return this.state.scale;
    }

    constructor(props) {
        super(props);
        this.ele = null;
        //画布中已有的图形
        this.shapes = [];
        //已经选中的图形的id
        this.selectedShapes = [];
        //绘制类型
        // this.definedDrawing = Object.assign({}, builtinDefinedDrawing, this.props.customDefinedDrawing);
        this.playingTimer = null;
        //播放的索引
        this.playingIndex = 0;
        //正在播放的action
        this.playingActions = [];
        //播放选项
        this.playingOption = null;
        //执行action的timter
        this.timer = null;
        this.state = {
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
    }

    /**
     * 根据id查找对应的图形
     * @private
     * */
    findShapeById(id) {
        const index = this.shapes.findIndex(f => f.id === id);
        return this.shapes[index];
    }

    getSelectedShapes() {
        return this.selectedShapes
    }

    /**
     * 将输入的坐标转换成屏幕坐标
     * @property {number} value - 如果坐标是屏幕坐标系就输入屏幕坐标,如果是数学坐标系就输入数学坐标
     * @private
     * */
    toScreenX(value) {
        return this.state.original.x + parseFloat(value) * this.state.scale;
    }

    /**
     * 将输入的坐标转成屏幕坐标
     * @property {number} value - 如果坐标是屏幕坐标系就输入屏幕坐标,如果是数学坐标系就输入数学坐标
     * @private
     * */
    toScreenY(value) {
        if (this.state.coordinateType === CoordinateEnum.screen) {
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
    toLocalX(screenX) {
        if (this.state.coordinateType === CoordinateEnum.math) {
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
    toLocalY(screenY) {
        if (this.state.coordinateType === CoordinateEnum.math) {
            return (this.state.original.y - screenY) / this.state.scale;
        }
        return screenY / this.state.scale;
    }

    async doActionsAsync(actions) {
        const action = actions.shift();
        if (action) {
            await this.doActionAsync(action);
            if (!action.canBreak) {
                //next
                this.timer = setTimeout(async () => {
                    await this.doActionsAsync(actions);
                }, action.nextInterval ? action.nextInterval : this.state.interval);
            }
            else {
                //保存后续的action,等待继续执行
                this._leftActions = actions;
            }
        }
    }

    async doActionAsync(action) {
        switch (action.type) {
            case ActionEnum.draw: {
                this.shapes.push(action.params);
                this.drawShapes([action.params]);
                break;
            }
            case ActionEnum.redraw: {
                const index = this.shapes.findIndex(f => f.id === action.params.id);
                if (index >= 0) {
                    if (action.params.state) {
                        for (let key in action.params.state) {
                            switch (Object.prototype.toString.call(this.shapes[index][key])) {
                                case "[object Object]":
                                    this.shapes[index][key] = Object.assign({}, this.shapes[index][key], action.params.state[key])
                                    // state[key] = {$set: };
                                    break;
                                default:
                                    this.shapes[index][key] = action.params.state[key];
                            }
                        }
                    }
                    this.drawShapes([this.shapes[index]]);
                }
                break;
            }
            case ActionEnum.select: {
                const id = action.params;
                let shape = this.findShapeById(id);
                if (shape.selected) {
                    await this.doActionAsync(new UnSelectAction(id));
                }
                else {
                    shape.selected = true;
                    if (this.props.selectMode === SelectModeEnum.single) {
                        //将已选中的shape取消选中
                        this.selectedShapes.map(f => f.id).forEach(async i => {
                            await this.doActionAsync(new UnSelectAction(i));
                        });
                        this.selectedShapes = [shape];
                    }
                    else {
                        this.selectedShapes.push(shape);
                    }
                }
                this.drawShapes([shape]);
                break;
            }
            case ActionEnum.unselect: {
                const id = action.params;
                let shape = this.findShapeById(id);
                shape.selected = false;
                this.selectedShapes = this.selectedShapes.filter(f => f.id !== id);
                this.drawShapes([shape]);
                break;
            }
            case ActionEnum.delete: {
                const id = action.params;
                //删除的图形
                const shape = this.shapes.find(s => s.id === id);
                //删除后的图形
                this.shapes = this.shapes.filter(s => s.id !== id);
                // if (shape.selection) {
                //     shape.selection.remove();
                //     delete shape.selection;
                // }
                if (shape) {
                    shape.remove();
                }
                break;
            }
            case ActionEnum.clear: {
                this.shapes.forEach(async shape => {
                    await this.doActionAsync(new DeleteAction(shape.id))
                });
                this.selectedShapes = [];
                break;
            }
            case ActionEnum.input: {
                //显示用户输入
                await this.showUserInputPromise(action);
                break;
            }
            case ActionEnum.move: {
                const shape = this.shapes.find(f => f.id === action.params.id);
                if (shape) {
                    shape.moveTo(action.params.vec);
                }
                break;
            }
        }
        this.setState(
            update(this.state, {
                actions: {$push: [action]}
            }),
            () => {
                if (this.props.onAction) {
                    this.props.onAction(action);
                }
            }
        );
    }

    /**
     * 显示用户输入
     * @private
     * @param action
     */
    showUserInputPromise(action) {
        return new Promise((resolve) => {
            this.setState({
                showUserInput: true,
                inputProperties: action.params
            }, () => {
                resolve();
            })
        });
    }

    /**
     * 隐藏用户输入并执行下一个action
     * @private
     */
    hideUserInput(nextActionOption) {
        const params = this.state.inputProperties.map(property => {
            return {
                path: property.fieldName,
                value: getPath(nextActionOption, property.fieldName)
            }
        })
        this.setState({
            showUserInput: false,
            inputProperties: []
        }, async () => {
            //执行下一个action
            if (this._leftActions.length > 0) {
                params.forEach(p => {
                    setPath(this._leftActions[0].params, p.path, p.value)
                });
            }
            await this.doActionsAsync(this._leftActions);
        })
    }

    drawShapes(shapes) {
        shapes.forEach(shape => {
            //初始化
            if (!shape.ready) {
                shape.initialize(this);
            }
            shape.render();
        })
    }

    /**
     * 获取图形数据
     *
     * @deprecated 请使用`getDrawingActions`代替
     * @return {*[]}
     */
    getDrawingData() {
        console.warn(`getDrawingData 方法将在下一个版本删除掉,请使用 getDrawingActions 代替`);
        const actions = this.state.actions.filter(f => f.type === ActionEnum.draw);
        return actions.map((item) => {
            const shape = this.findShapeById(item.params.id);
            return {
                type: item.type,
                params: (shape && shape.toData) ? [shape.toData()] : [item.params.toData()]
            }
        });
    }

    /**
     * 获取所有绘图的action
     * @return {*[]}
     */
    getDrawingActions() {
        const actions = this.state.actions.filter(f => f.type === ActionEnum.draw);
        return actions.map((item) => {
            const shape = this.findShapeById(item.params.id);
            return {
                type: item.type,
                params: (shape && shape.toData) ? [shape.toData()] : [item.params.toData()]
            }
        });
    }

    /**
     * 清除画布,这个方法除了会把画布上的内容清除以外还会重置内部的action状态
     */
    async clear() {
        await this.doActionAsync(new ClearAction());
        this.setState({
            actions: []
        });
    }

    play(actions, playingOps) {
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
    playNextAction() {
        if (this.playingIndex >= this.playingActions.length) {
            return;
        }
        const action = this.playingActions[this.playingIndex];
        this.doActionsAsync([action]);
        if (action.canBreak) {
            return;
        }
        this.playingIndex++;
        this.playingTimer = setTimeout(this.playNextAction.bind(this), action.nextInterval ? action.nextInterval : getPath(this.playingOption, "interval", 1000));
    }

    stop() {
        if (this.playingTimer) {
            clearTimeout(this.playingTimer);
        }
    }

    render() {
        return (
            <WorkSpace actions={this.props.renderToolbar(this)}>
                <svg ref={ref => this.ele = ref} {...this.state.attrs}>
                </svg>
                {this.state.showUserInput && <UserInput properties={this.state.inputProperties}
                                                        onOK={(value) => {
                                                            //执行下一个action,并把用户的输入参数参入到下一个action
                                                            this.hideUserInput(value);
                                                        }}/>}
            </WorkSpace>
        );
    }

    componentWillReceiveProps(nextProps) {
        let newState = {};
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
        const doActions = () => {
            if (nextProps.actions.length > 0) {
                this.doActionsAsync(nextProps.actions);
            }
        }
        const keys = Object.keys(newState);
        if (keys.length > 0) {
            this.setState(newState, doActions);
        }
        else {
            doActions();
        }
    }

    async componentDidMount() {
        await this.doActionsAsync(this.props.actions);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    removeAllSvgEvent() {
        const svg = d3.select(this.ele);
        svg.on("click", null)
            .on("mousedown", null)
            .on("mousemove", null)
            .on("mouseup", null)
    }
}
//#endregion
