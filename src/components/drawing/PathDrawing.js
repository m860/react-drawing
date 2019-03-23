import TagDrawing from "./TagDrawing";
import type {DrawingOption, IPathDrawing, Path, PathOption, Point, TagDrawingOption} from "../Types";
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
        const d = this.d.map((item: Path) => {
            if ((item.x === null || item.x === undefined) || (item.y === null || item.y === undefined)) {
                return item.action;
            }
            return `${item.action} ${this.graph.toScreenX(item.x)} ${this.graph.toScreenY(item.y)}`
        });
        super.render({d: d.join(" ")})
    }

    getPosition() {
        return null;
    }

    moveTo(vec: Point) {
    }
}