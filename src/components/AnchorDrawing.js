import type {AnchorDrawingOption, IAnchorDrawing, Point} from "./Types";
import Drawing from "./Drawing";
import * as d3 from 'd3'

const DefaultAnchorOption: AnchorDrawingOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": "1px",
        r: "10px"
    }
};

export default class AnchorDrawing extends Drawing implements IAnchorDrawing {
    constructor(option: AnchorDrawingOption) {
        const opt = Object.assign({}, DefaultAnchorOption, option);
        super(opt);
        this.type = "anchor";
        this.from = opt.from;
        this.to = opt.to;
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append("circle");
    }

    getPosition(): Point {
        return {
            x: parseFloat(this.selection.attr("cx")),
            y: parseFloat(this.selection.attr('cy'))
        }
    }
}