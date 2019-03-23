import Drawing from "./Drawing";
import * as d3 from 'd3'
import merge from "deepmerge"
import type {ILinkTextDrawing, LinkTextOption, Point} from "../Types";

const DefaultLinkTextOption: LinkTextOption = {
    attrs: {
        "font-size": "12px",
        fill: "black",
        stroke: "black",
        "dominant-baseline": "middle",
        "text-anchor": "middle"
    }
};

export default class LinkTextDrawing extends Drawing implements ILinkTextDrawing {
    constructor(option: LinkTextOption) {
        const opt = merge(DefaultLinkTextOption, option || {});
        super(opt);
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append("text");
    }

    getPosition(): Point {
        return {
            x: parseFloat(this.selection.attr("x")),
            y: parseFloat(this.selection.attr("y"))
        }
    }

}