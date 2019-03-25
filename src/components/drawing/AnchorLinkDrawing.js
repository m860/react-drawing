import Drawing from "./Drawing";
import type {AnchorLinkOption, IAnchorLinkDrawing} from "../Types";
import * as d3 from "d3";
import DrawingEvents from "./DrawingEvents";
import merge from "deepmerge"
import {LinkDrawingModeType} from "../Enums";
import {get as getPath} from "object-path";
import {generatePathForLineWithArrow} from "../Utils";

const DefaultAnchorLinkOption: AnchorLinkOption = {
    attrs: {
        fill: "black",
        stroke: "black",
        "stroke-width": 2
    }
};

export default class AnchorLinkDrawing extends Drawing implements IAnchorLinkDrawing {
    constructor({from, to, mode, ...option}: AnchorLinkOption) {
        if (!from) {
            throw new Error(`option.from is required`);
        }
        if (!to) {
            throw new Error(`option.to is required`);
        }
        super(merge(DefaultAnchorLinkOption, option || {}));
        this.from = from;
        this.to = to;
        this.mode = merge({
            type: LinkDrawingModeType.line
        }, mode || {});
    }

    initialize(...args) {
        super.initialize(...args);
        if (this.mode.type === LinkDrawingModeType.line) {
            this.selection = d3.select(this.graph.ele).append("line");
        }
        else if (this.mode.type === LinkDrawingModeType.lineWithArrow) {
            this.selection = d3.select(this.graph.ele).append("path");
        }

        this.addListener(DrawingEvents.anchorRender(this.from.id), () => this.render());
        this.addListener(DrawingEvents.anchorRender(this.to.id), () => this.render());
    }

    render() {
        if (this.mode.type === LinkDrawingModeType.line) {
            this.renderLine();
        }
        else if (this.mode.type === LinkDrawingModeType.lineWithArrow) {
            this.renderLineWithArrow();
        }
    }

    renderLine() {
        const fromPosition = this.from.getPosition();
        const toPosition = this.to.getPosition();
        const nextAttrs = {
            x1: fromPosition.x,
            y1: fromPosition.y,
            x2: toPosition.x,
            y2: toPosition.y
        };
        super.render(nextAttrs);
    }


    renderLineWithArrow() {
        const fromPosition = this.from.getPosition();
        const toPosition = this.to.getPosition();
        const distance = getPath(this.mode, "option.distance", 5);
        const d = generatePathForLineWithArrow(fromPosition, toPosition, distance / this.graph.scale);
        super.render({d: this.formatPath(d)});
    }

    getPosition() {
        const fromPosition = this.from.getPosition();
        const toPosition = this.to.getPosition();
        const hw = Math.abs(fromPosition.x - toPosition.x) / 2;
        const hh = Math.abs(fromPosition.y - toPosition.y) / 2;
        return {
            x: Math.min(fromPosition.x, toPosition.x) + hw,
            y: Math.min(fromPosition.y, toPosition.y) + hh
        };
    }
}