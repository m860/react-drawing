import type {DrawingOption, IAnchorDrawing, IDrawing, Point} from "./Types";
import UUID from "uuid/v1";
import deepcopy from "deepcopy"
import {SelectAction} from "./D3Graph";

export default class Drawing implements IDrawing {
    constructor(option: DrawingOption) {
        this.id = UUID();
        this.attrs = option.attrs;
        this.selectedAttrs = option.selectedAttrs;
        this.text = option.text;
        this.ready = false;
        this.selected = false;
        this.anchors = [];
    }

    applyAttrs(attrs = {}) {
        if (this.selection) {
            this.selection.call(self => {
                for (let key in attrs) {
                    if (key in ["x", "x1", "x2", "cx"]) {
                        self.attr(key, this.graph.toScreenX(attrs[key]));
                    }
                    else if (key in ["y", "y1", "y2", "cy"]) {
                        self.attr(key, this.graph.toScreenY(attrs[key]));
                    }
                    else {
                        self.attr(key, attrs[key]);
                    }
                }
            });
            this.selection.attr("shape-id", this.id);
            this.text && this.selection.text(this.text);
        }
    }

    initialize(graph) {
        this.graph = graph;
        this.ready = true;
    }

    render(nextAttrs = {}) {
        const attrs = Object.assign({}, this.attrs, this.selected ? this.selectedAttrs : {}, nextAttrs);
        this.applyAttrs(attrs);
        const position = this.getPosition();
        this.anchors.forEach((anchor: IAnchorDrawing) => anchor.render({
            cx: position.x,
            cy: position.y
        }))
    }

    select() {
        if (this.graph) {
            this.graph.doActionsAsync([
                new SelectAction(this.id)
            ])
        }
    }

    remove() {
        if (this.selection) {
            this.selection.remove();
        }
        this.selection = null;
    }

    moveTo(vec: Point) {
        throw new Error("Not implementation");
    }

    getPosition(): Point {
        throw new Error("Not implementation");
    }

    toData() {
        return {
            type: this.type,
            option: {
                id: this.id,
                attrs: deepcopy(this.attrs),
                text: this.text
            }
        }
    }
}