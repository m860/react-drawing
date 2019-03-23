import TagDrawing from "./TagDrawing";
import type {DrawingOption, Point, TagDrawingOption} from "../Types";
import merge from "deepmerge"

const DefaultCircleOption: DrawingOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        r: 10,
        "stroke-width": 1
    }
};

export default class CircleDrawing extends TagDrawing {
    constructor(option: DrawingOption) {
        const opt: TagDrawingOption = merge.all([DefaultCircleOption, option, {tag: "circle"}])
        super(opt);
    }

    getPosition() {
        return {
            x: parseFloat(this.selection.attr("cx")),
            y: parseFloat(this.selection.attr("cy"))
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