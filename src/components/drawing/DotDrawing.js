import type {DrawingOption, Point, TagDrawingOption} from "../Types";
import merge from "deepmerge"
import CircleDrawing from "./CircleDrawing";

const DefaultDotOption: DrawingOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        r: 6
    }
};

export default class DotDrawing extends CircleDrawing {
    constructor(option: DrawingOption) {
        const opt: TagDrawingOption = merge.all([DefaultDotOption, option])
        super(opt);
    }
}