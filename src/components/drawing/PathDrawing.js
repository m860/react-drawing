import TagDrawing from "./TagDrawing";
import type {IPathDrawing, PathOption, Point, TagDrawingOption} from "../Types";
import merge from "deepmerge"

const DefaultPathOption: PathOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": 4
    }
};

export default class PathDrawing extends TagDrawing implements IPathDrawing {
    constructor(option: PathOption) {
        const opt: TagDrawingOption = merge.all([DefaultPathOption, option, {tag: "path"}])
        super(opt);
        if (!option.d || option.d.length === 0) {
            throw new Error("option.d is required");
        }
        this.d = option.d;
    }

    render(nextAttrs = {}) {
        super.render({d: this.formatPath(this.d)})
    }

    getPosition() {
        return null;
    }

    moveTo(vec: Point) {
    }
}