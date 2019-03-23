import Drawing from "./Drawing";
import type {
    IAnchorDrawing,
    ILinkDrawing,
    ILinkTextDrawing,
    LinkDrawingOption,
    LinkTextOption,
    PathType,
    Point
} from "../Types";
import * as d3 from 'd3'
import {LinkDrawingModeType} from "../Enums";
import merge from "deepmerge"
import DrawingEvents from "./DrawingEvents";
import LinkTextDrawing from "./LinkTextDrawing";
import {get as getPath} from "object-path"

const DefaultLinkOption: LinkDrawingOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": 2
    },
    mode: {
        type: LinkDrawingModeType.line
    }
};

export default class LinkDrawing extends Drawing implements ILinkDrawing {
    constructor(option: LinkDrawingOption) {
        const opt = merge(DefaultLinkOption, option || {});
        super(opt);
        this.from = opt.from;
        this.to = opt.to;
        this.mode = opt.mode;
        if (opt.linkText && opt.linkText.length > 0) {
            //create link text
            this.linkText = opt.linkText.map((linkTextOption: LinkTextOption) => {
                return new LinkTextDrawing(linkTextOption);
            });
        }
        else {
            this.linkText = [];
        }
    }

    _getAllAnchorID(): [string, string] {
        const [fromShapeID, fromAnchorID] = this.from;
        const [toShapeID, toAnchorID] = this.to;
        return [fromAnchorID, toAnchorID];
    }


    _getAllAnchors(): [IAnchorDrawing, IAnchorDrawing] {
        const [fromShapeID, fromAnchorID] = this.from;
        const [toShapeID, toAnchorID] = this.to;
        const fromShape = this.graph.findShapeById(fromShapeID);
        const toShape = this.graph.findShapeById(toShapeID);
        if (fromShape && toShape) {
            const fromAnchor = fromShape.findAnchor(fromAnchorID);
            const toAnchor = toShape.findAnchor(toAnchorID);
            if (fromAnchor && toAnchor) {
                return [fromAnchor, toAnchor];
            }
        }
        return [null, null];
    }

    /**
     * 当anchor
     * @param anchorID
     */
    onAnchorRender = () => {
        this.render();
    };

    initialize(...args) {
        super.initialize(...args);
        //initial LinkTextDrawing
        this.linkText.forEach((linkText: ILinkTextDrawing) => linkText.initialize(...args));
        switch (this.mode.type) {
            case LinkDrawingModeType.line:
                this.selection = d3.select(this.graph.ele).append("line");
                break;
            case LinkDrawingModeType.lineWithArrow:
                this.selection = d3.select(this.graph.ele).append("path");
                break;
            case LinkDrawingModeType.multipleLine:
            default:
                throw new Error("Not implementation");
        }
        const [fromAnchorID, toAnchorID] = this._getAllAnchorID();
        this.addListener(DrawingEvents.anchorRender(fromAnchorID), this.onAnchorRender);
        this.addListener(DrawingEvents.anchorRender(toAnchorID), this.onAnchorRender);
    }

    renderLine() {
        const [fromAnchor, toAnchor] = this._getAllAnchors();
        if (fromAnchor && toAnchor) {
            const fromPosition = fromAnchor.getPosition();
            const toPosition = toAnchor.getPosition();
            const nextAttrs = {
                x1: fromPosition.x,
                y1: fromPosition.y,
                x2: toPosition.x,
                y2: toPosition.y
            };
            super.render(nextAttrs);
        }

    }

    render() {
        if (this.mode.type === LinkDrawingModeType.line) {
            this.renderLine();
        }
        else if (this.mode.type === LinkDrawingModeType.lineWithArrow) {
            this.renderLineWithArrow();
        }
        const textBasePosition = this.getTextPosition();
        this.linkText.forEach((linkText: ILinkTextDrawing) => {
            linkText.render({
                x: textBasePosition.x,
                y: textBasePosition.y
            })
        });
    }

    getPosition(): Point {
        return null;
    }

    getTextPosition(): Point {
        const [fromAnchor, toAnchor] = this._getAllAnchors();
        if (fromAnchor && toAnchor) {
            const fromPosition = fromAnchor.getPosition();
            const toPosition = toAnchor.getPosition();
            const hx = Math.abs(fromPosition.x - toPosition.x) / 2;
            const hy = Math.abs(fromPosition.y - toPosition.y) / 2;
            return {
                x: Math.min(fromPosition.x, toPosition.x) + hx,
                y: Math.min(fromPosition.y, toPosition.y) + hy
            }
        }
        return null;
    }

    remove() {
        super.remove();
        //remove LinkTextDrawing
        this.linkText.forEach((linkText: ILinkTextDrawing) => linkText.remove());
    }

    generatePathForLineWithArrow(begin: Point, end: Point, distance: number): Array<PathType> {
        const diffX = begin.x - end.x;
        const diffY = begin.y - end.y;
        const a = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        const ex = diffX / a;
        const ey = diffY / a;

        const q2x = end.x + ex * distance;
        const q2y = end.y + ey * distance;

        const fx = Math.cos(Math.PI / 2) * ex + Math.sin(Math.PI / 2) * ey;
        const fy = -Math.sin(Math.PI / 2) * ex + Math.cos(Math.PI / 2) * ey;
        const q1x = q2x + fx * distance * 0.5;
        const q1y = q2y + fy * distance * 0.5;

        const gx = Math.cos(-Math.PI / 2) * ex + Math.sin(-Math.PI / 2) * ey;
        const gy = -Math.sin(-Math.PI / 2) * ex + Math.cos(-Math.PI / 2) * ey;
        const q3x = q2x + gx * distance * 0.5;
        const q3y = q2y + gy * distance * 0.5;

        return [
            {action: "M", x: begin.x, y: begin.y},
            {action: "L", x: q2x, y: q2y},
            {action: "L", x: q1x, y: q1y},
            {action: "L", x: end.x, y: end.y},
            {action: "L", x: q3x, y: q3y},
            {action: "L", x: q2x, y: q2y},
            {action: "L", x: begin.x, y: begin.y},
            {action: "Z"}
        ];
    }

    renderLineWithArrow() {
        const [fromAnchor, toAnchor] = this._getAllAnchors();
        if (fromAnchor && toAnchor) {
            const fromPosition = fromAnchor.getPosition();
            const toPosition = toAnchor.getPosition();
            const distance = getPath(this.mode, "option.distance", 5);
            const d = this.generatePathForLineWithArrow(fromPosition, toPosition, distance / this.graph.scale);
            super.render({d: this.formatPath(d)});
        }
    }
}
