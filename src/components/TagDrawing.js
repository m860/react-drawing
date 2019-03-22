import Drawing from "./Drawing";
import type {ITagDrawing, Point, TagDrawingOption} from "./Types";
import * as d3 from 'd3'
import merge from "deepmerge"

const DefaultTagOption: TagDrawingOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        r: "10px",
        cx: 100,
        cy: 100
    },
    tag: "circle",
    moveTo: function (vec: Point) {
        if (this.selection) {
            const position = this.getPosition();
            const nextPosition = {
                x: position.x + vec.x,
                y: position.y + vec.y
            };
            this.render({
                cx: nextPosition.x,
                cy: nextPosition.y
            });
        }
    }
};

export default class TagDrawing extends Drawing implements ITagDrawing {
    constructor(option: TagDrawingOption) {
        const opt = merge(DefaultTagOption, option);
        super(opt);
        this.tag = opt.tag;
        this.moveTo = opt.moveTo.bind(this);
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