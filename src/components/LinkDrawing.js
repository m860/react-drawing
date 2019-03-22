import Drawing from "./Drawing";
import type {ILinkDrawing, LinkDrawingOption} from "./Types";
import * as d3 from 'd3'
import {LinkDrawingModeType} from "./Enums";
import merge from "deepmerge"
import DrawingEvents from "./DrawingEvents";

const DefaultLinkOption: LinkDrawingOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": "1px"
    },
    mode: {
        type: LinkDrawingModeType.line
    }
};

export default class LinkDrawing extends Drawing implements ILinkDrawing {
    constructor(option: LinkDrawingOption) {
        const opt = merge(DefaultLinkOption, option);
        super(opt);
        this.from = opt.from;
        this.to = opt.to;
        this.mode = opt.mode;
    }

    /**
     * 当anchor
     * @param anchorID
     */
    onAnchorRender = () => {
        this.render();
    };

    initialize(...args) {
        super.initialize(...args);
        switch (this.mode.type) {
            case LinkDrawingModeType.line:
                this.selection = d3.select(this.graph.ele).append("line");
                break;
            case LinkDrawingModeType.lineWithArrow:
            case LinkDrawingModeType.multipleLine:
            default:
                throw new Error("Not implementation");
        }
        const [fromShapeID, fromAnchorID] = this.from;
        const [toShapeID, toAnchorID] = this.to;
        this.addListener(DrawingEvents.anchorRender(fromAnchorID), this.onAnchorRender);
        this.addListener(DrawingEvents.anchorRender(toAnchorID), this.onAnchorRender);
    }

    render() {
        const [fromShapeID, fromAnchorID] = this.from;
        const [toShapeID, toAnchorID] = this.to;
        const fromShape = this.graph.findShapeById(fromShapeID);
        const toShape = this.graph.findShapeById(toShapeID);
        if (fromShape && toShape) {
            const fromAnchor = fromShape.findAnchor(fromAnchorID);
            const toAnchor = toShape.findAnchor(toAnchorID);
            if (fromAnchor && toAnchor) {
                const fromPosition = fromAnchor.getPosition();
                const toPosition = toAnchor.getPosition();
                const nextAttrs = {
                    x1: fromPosition.x,
                    y1: fromPosition.y,
                    x2: toPosition.x,
                    y2: toPosition.y
                };
                super.render(nextAttrs);
            }
        }

    }

    getPosition() {
        return null;
    }
}
