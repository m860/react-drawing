import TagDrawing from "./TagDrawing";
import type {DrawingOption, Point, TagDrawingOption} from "../Types";
import merge from "deepmerge"

const DefaultRectOption: DrawingOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        width: 100,
        height: 50
    }
};

export default class RectDrawing extends TagDrawing {
    constructor(option: DrawingOption) {
        const opt: TagDrawingOption = merge.all([DefaultRectOption, option, {tag: "rect"}])
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
                cx: x + vec.x,
                cy: y + vec.y,
            })
        }
    }
}