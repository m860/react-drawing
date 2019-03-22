import Drawing from "./Drawing";
import type {ISimpleDrawing, Point, SimpleDrawingOption} from "./Types";
import * as d3 from 'd3'

const DefaultSimpleOption: SimpleDrawingOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        r: "10px",
        cx: 100,
        cy: 100
    },
    tag: "circle"
};

export default class SimpleDrawing extends Drawing implements ISimpleDrawing {
    constructor(option: SimpleDrawingOption) {
        const opt = Object.assign({}, DefaultSimpleOption, option);
        super(opt);
        this.tag = opt.tag;
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append(this.tag);
    }

    getPosition(): Point {
        return {
            x: parseFloat(this.selection.attr("cx")),
            y: parseFloat(this.selection.attr("cy"))
        }
    }

}