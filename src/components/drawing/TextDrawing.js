import TagDrawing from "./TagDrawing";
import type {DrawingOption, Point, TagDrawingOption} from "../Types";
import merge from "deepmerge"

const DefaultTextOption: DrawingOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        "font-size": 12,
        "dominant-baseline": "middle",
        "text-anchor": "middle"
    }
};

export default class TextDrawing extends TagDrawing {
    constructor(option: DrawingOption) {
        const opt: TagDrawingOption = merge.all([DefaultTextOption, option, {tag: "text"}])
        super(opt);
    }

    getPosition() {
        return {
            x: parseFloat(this.selection.attr("x")),
            y: parseFloat(this.selection.attr("y"))
        }
    }

    moveTo(vec: Point) {
        if (this.selection) {
            const {x, y} = this.getPosition();
            super.render({
                x: x + vec.x,
                y: y + vec.y,
            })
        }
    }
}