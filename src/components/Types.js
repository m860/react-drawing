import {LinkDrawingModeType} from "./Enums";

export type Point = {
    x: number,
    y: number
}

export type DrawingOption = {
    attrs?: Object,
    selectedAttrs?: Object,
    text?: string | Function
};

export type AnchorDrawingOption = DrawingOption & {
    from: string,
    to: string
};

export type LinkDrawingMode = {
    type: $Values<typeof LinkDrawingModeType>,
    option: Object
};

export type LinkDrawingOption = DrawingOption & {
    from: string,
    to: string,
    mode: LinkDrawingMode
}

export type SimpleDrawingOption = DrawingOption & {
    tag: string
}

export interface IDrawing {
    constructor: (option: DrawingOption) => void
    id: string,
    graph: any,
    /**
     * 文本内容
     */
    text: string | Function,
    /**
     * 属性,标准的svg属性
     */
    attrs: Object,
    /**
     * 选中的属性,标准的svg属性
     */
    selectedAttrs: Object,
    /**
     * D3.Selection
     */
    selection: any,
    /**
     * 图形的类型
     */
    type: string,
    /**
     * 是否已经初始化
     */
    ready: boolean,
    /**
     * 图形是否被选中
     */
    selected: boolean,
    /**
     * anchors
     */
    anchors: Array<IAnchorDrawing>,
    /**
     * 绘制图形
     */
    select: () => void,
    /**
     * 设置svg的属性
     */
    applyAttrs: () => void,
    initialize: (graph: mixed) => void,
    render: (nextAttrs: mixed) => void,
    remove: () => void,
    moveTo: (vec: Point) => void,
    getPosition: () => Point,
    toData: () => Object
}

export interface ILinkDrawing {
    from: string,
    to: string,
    mode: LinkDrawingMode
}

export interface ISimpleDrawing {
    tag: string
}

export interface IAnchorDrawing {

}