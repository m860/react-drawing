import Drawing from "./Drawing";
import type {IAnchorDrawing, ILinkDrawing, ILinkTextDrawing, LinkDrawingOption, LinkTextOption, Point} from "../Types";
import {LinkDrawingModeType} from "../Enums";
import merge from "deepmerge"
import LinkTextDrawing from "./LinkTextDrawing";
import AnchorLinkDrawing from "./AnchorLinkDrawing";
import DrawingEvents from "./DrawingEvents";

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
        this.renderText();
    };

    initialize(...args) {
        super.initialize(...args);
        const [fromAnchor, toAnchor] = this._getAllAnchors();
        this.link = new AnchorLinkDrawing({
            from: fromAnchor,
            to: toAnchor,
            mode: this.mode,
            attrs: this.attrs,
            selectedAttrs: this.selectedAttrs
        });
        this.link.initialize(...args);
        //initial LinkTextDrawing
        this.linkText.forEach((linkText: ILinkTextDrawing) => linkText.initialize(...args));
        this.addListener(DrawingEvents.anchorRender(fromAnchor.id), this.onAnchorRender);
        this.addListener(DrawingEvents.anchorRender(toAnchor.id), this.onAnchorRender);
    }

    render() {
        this.link.render();
        this.renderText();
    }

    renderText() {
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
        this.link.remove();
        //remove LinkTextDrawing
        this.linkText.forEach((linkText: ILinkTextDrawing) => linkText.remove());
    }

}
