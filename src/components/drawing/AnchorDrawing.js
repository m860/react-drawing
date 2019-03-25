import type {AnchorDrawingOption, IAnchorDrawing, Point} from "../Types";
import Drawing from "./Drawing";
import * as d3 from 'd3'
import merge from "deepmerge"
import DrawingEvents from "./DrawingEvents";

const DefaultAnchorOption: AnchorDrawingOption = {
    attrs: {
        fill: "blue",
        stroke: "blue",
        r: 4,
        opacity: 0.2
    }
};

/**
 * Anchor的位置是相对于所在图形的getPosition来确定的
 */
export default class AnchorDrawing extends Drawing implements IAnchorDrawing {
    constructor(option: AnchorDrawingOption) {
        const opt = merge(DefaultAnchorOption, option || {});
        super(opt);
        this.offset = opt.offset;
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append("circle");
        this.applyAttrs(this.attrs);
    }

    getPosition(): Point {
        return {
            x: parseFloat(this.selection.attr("cx")),
            y: parseFloat(this.selection.attr("cy"))
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