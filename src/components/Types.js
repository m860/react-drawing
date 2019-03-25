import {ActionEnum, LinkDrawingModeType} from "./Enums";

export type Point = {
    x: number,
    y: number
}

export type DrawingType = {
    type: string,
    option: DrawingOption & *
};

export type PathType = Point & {
    action: string
};

export type ActionType = {
    type: $Values<typeof ActionEnum>,
    params: [DrawingType]
};

export type DrawingOption = {
    attrs?: Object,
    selectedAttrs?: Object,
    text?: string | Function,
    anchors?: Array<AnchorDrawingOption>
};

export interface IDrawing {
    constructor: (option: DrawingOption) => void,
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
    listeners: Array,

    /**
     * 绘制图形
     */
    select(): void,

    /**
     * 设置svg的属性
     */
    applyAttrs(attrs: Object): void,

    initialize(graph: mixed): void,

    render(nextAttrs: mixed): void,

    remove(): void,

    moveTo(vec: Point): void,

    getPosition(): Point,

    toData(): Object,

    findAnchor(id: string): IAnchorDrawing,

    once(name: string, callback: Function): void,

    addListener(name: string, callback: Function): void,

    emit(name: string, data: any): void,

    formatPath(data: Array<PathType>): string,

    findDrawingByID(id: string): ?IDrawing
}

export type LinkDrawingMode = {
    type: $Values<typeof LinkDrawingModeType>,
    option: Object
};
export type LinkDrawingOption = DrawingOption & {
    /**
     * 需要连接的图形的ID和anchor ID
     */
    from: [string, string],
    /**
     * 需要连接的图形的ID
     */
    to: [string, string],
    mode: LinkDrawingMode,
    linkText?: Array<LinkTextOption>
}

export interface ILinkDrawing extends IDrawing {
    from: string,
    to: string,
    mode: LinkDrawingMode,
    linkText: Array<ILinkTextDrawing>,
    link: IAnchorLinkDrawing,

    getTextPosition(): Point
}

export type TagDrawingOption = DrawingOption & {
    tag: string,
}

export interface ITagDrawing extends IDrawing {
    tag: string
}

export type AnchorDrawingOption = DrawingOption & {
    /**
     * Anchor的相对位置,基于所在图形的getPosition来确定真实的位置
     */
    offset: Point
};

export interface IAnchorDrawing extends IDrawing {
    offset: Point,

    getOffset(): Point
}

export type AnchorLinkOption = DrawingOption & {
    from: IAnchorDrawing,
    to: IAnchorDrawing,
    mode: LinkDrawingMode
};

export interface IAnchorLinkDrawing extends IDrawing {
    from: IAnchorDrawing,
    to: IAnchorDrawing,
    mode: LinkDrawingMode
}

export type LinkTextOption = DrawingOption & {};

export interface ILinkTextDrawing extends IDrawing {
}

export type PathOption = DrawingOption & {
    d: Array<PathType>
}

export interface IPathDrawing extends IDrawing {
    d: Array<PathType>
}

export type GroupOption = DrawingOption & {
    drawings: Array<DrawingType>
};

export interface IGroupDrawing extends IDrawing {
    drawings: Array<IDrawing & *>
}

export type TextCircleOption = DrawingOption & {
    textOption: DrawingOption
}

export interface ITextCircleDrawing extends IDrawing {
    textDrawing: IDrawing
}

export type NumberScaleOption = DrawingOption & {
    original: Point,
    xAxisLength: number,
    yAxisLength: number,
    scale: number
}

export interface INumberScaleDrawing extends IDrawing {
    original: Point,
    xAxisLength: number,
    yAxisLength: number,
    scale: number
}

export interface IJointDrawing extends IAnchorDrawing {

}

export type PolylineLinkDrawingOption = LinkDrawingOption & {
    jointCount: number
}

export interface IPolylineLinkDrawing extends ILinkDrawing {
    jointCount: number,
    joints: Array<IJointDrawing>,
    links: Array<IAnchorLinkDrawing>
}