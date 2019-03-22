import Drawing from "./Drawing";
import type {ILinkDrawing, LinkDrawingOption} from "./Types";
import * as d3 from 'd3'
import {LinkDrawingModeType} from "./Enums";

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
        const opt = Object.assign({}, DefaultLinkOption, option);
        super(opt);
        this.from = opt.from;
        this.to = opt.to;
        this.mode = opt.mode;
    }

    initialize(...args) {
        super.initialize(...args);
        switch (this.mode.type) {
            case LinkDrawingModeType.line:
                this.selection = d3.select(this.graph.ele).append("line");
                return;
            case LinkDrawingModeType.lineWithArrow:
            case LinkDrawingModeType.multipleLine:
            default:
                throw new Error("Not implementation");
        }
    }

    render() {
        const fromShape = this.graph.findShapeById(this.from);
        const toShape = this.graph.findShapeById(this.to);
        const fromPosition = fromShape.getPosition();
        const toPosition = toShape.getPosition();
        const nextAttrs = {
            x1: fromPosition.x,
            y1: fromPosition.y,
            x2: toPosition.x,
            y2: toPosition.y
        };
        super.render(nextAttrs);
    }
}
