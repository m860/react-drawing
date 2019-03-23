import type {AnchorDrawingOption, IAnchorDrawing, Point} from "../Types";
import Drawing from "./Drawing";
import * as d3 from 'd3'
import merge from "deepmerge"
import DrawingEvents from "./DrawingEvents";

const DefaultAnchorOption: AnchorDrawingOption = {
    attrs: {
        fill: "red",
        stroke: "red",
        "stroke-width": "1px",
        r: 4
    }
};

/**
 * Anchor的位置是相对于所在图形的getPosition来确定的
 */
export default class AnchorDrawing extends Drawing implements IAnchorDrawing {
    constructor(option: AnchorDrawingOption) {
        const opt = merge(DefaultAnchorOption, option||{});
        super(opt);
        this.type = "anchor";
        this.offset = opt.offset;
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append("circle");
    }

    getPosition(): Point {
        return {
            x: this.selection.attr("cx"),
            y: this.selection.attr("cy")
        };
    }

    render(...args) {
        super.render(...args);
        //通知LinkDrawing重新绘制
        this.emit(DrawingEvents.anchorRender(this.id));
    }

    getOffset(): Point {
        return this.offset;
    }
}