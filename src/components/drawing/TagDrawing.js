import Drawing from "./Drawing";
import type {ITagDrawing, Point, TagDrawingOption} from "../Types";
import * as d3 from 'd3'
import merge from "deepmerge"

const DefaultTagOption: TagDrawingOption = {};

export default class TagDrawing extends Drawing implements ITagDrawing {
    constructor(option: TagDrawingOption) {
        const opt = merge(DefaultTagOption, option || {});
        if (!opt.tag || opt.tag.length === 0) {
            throw new Error("option.tag is required");
        }
        super(opt);
        this.tag = opt.tag;
        // this.moveTo = opt.moveTo.bind(this);
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append(this.tag);
    }

    moveTo(vec: Point) {
        throw new Error("Not implementation");
    }

}