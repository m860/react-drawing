import TagDrawing from "./TagDrawing";
import type {DrawingOption, Point, TagDrawingOption} from "../Types";
import merge from "deepmerge"

const DefaultLineOption: DrawingOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        "stroke-width": 4
    }
};

export default class LineDrawing extends TagDrawing {
    constructor(option: DrawingOption) {
        const opt: TagDrawingOption = merge.all([DefaultLineOption, option, {tag: "line"}])
        super(opt);
    }

    _getLinePosition(): Object {
        const x1 = parseFloat(this.selection.attr("x1"));
        const x2 = parseFloat(this.selection.attr("x2"));
        const y1 = parseFloat(this.selection.attr("y1"));
        const y2 = parseFloat(this.selection.attr("y2"));
        return {
            x1, x2, y1, y2
        }
    }

    getPosition() {
        const {x1, x2, y1, y2} = this._getLinePosition();
        return {
            x: Math.min(x1, x2) + Math.abs(x1 - x2) / 2,
            y: Math.min(y1, y2) + Math.abs(y1 - y2) / 2
        }
    }

    moveTo(vec: Point) {
        if (this.selection) {
            const {x1, x2, y1, y2} = this._getLinePosition();
            super.render({
                x1: x1 + vec.x,
                x2: x2 + vec.x,
                y1: y1 + vec.y,
                y2: y2 + vec.y,
            })
        }
    }
}