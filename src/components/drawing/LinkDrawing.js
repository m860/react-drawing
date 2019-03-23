import Drawing from "./Drawing";
import type {
    IAnchorDrawing,
    IDrawing,
    ILinkDrawing,
    ILinkTextDrawing,
    LinkDrawingOption,
    LinkTextOption,
    Point
} from "../Types";
import * as d3 from 'd3'
import {LinkDrawingModeType} from "../Enums";
import merge from "deepmerge"
import DrawingEvents from "./DrawingEvents";
import LinkTextDrawing from "./LinkTextDrawing";

const DefaultLinkOption: LinkDrawingOption = {
    attrs: {
        fill: "transparent",
        stroke: "black",
        "stroke-width": "1px"
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
            case LinkDrawingModeType.multipleLine:
            default:
                throw new Error("Not implementation");
        }
        const [fromAnchorID, toAnchorID] = this._getAllAnchorID();
        this.addListener(DrawingEvents.anchorRender(fromAnchorID), this.onAnchorRender);
        this.addListener(DrawingEvents.anchorRender(toAnchorID), this.onAnchorRender);
    }

    render() {
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
}
