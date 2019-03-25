import AnchorDrawing from "./AnchorDrawing";
import type {IJointDrawing, Point} from "../Types";
import * as d3 from "d3"

export default class JointDrawing extends AnchorDrawing implements IJointDrawing {
    initialize(...args) {
        super.initialize(...args);
        this.selection.on("mouseover", function () {
            d3.select(this).style("cursor", "move");
        }).on("mouseout", function () {
            d3.select(this).style("cursor", "default");
        })
    }

    moveTo(vec: Point) {
        if (this.selection) {
            const position = this.getPosition();
            super.render({
                cx: position.x + vec.x,
                cy: position.y + vec.y
            })
        }
    }
}