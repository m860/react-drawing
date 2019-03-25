import type {
    IAnchorDrawing,
    IAnchorLinkDrawing,
    IJointDrawing,
    IPolylineLinkDrawing,
    Point,
    PolylineLinkDrawingOption
} from "../Types";
import merge from "deepmerge"
import AnchorLinkDrawing from "./AnchorLinkDrawing";
import AnchorDrawing from "./AnchorDrawing";
import Drawing from "./Drawing";
import JointDrawing from "./JointDrawing";

const DefaultPolylineLinkDrawingOption: PolylineLinkDrawingOption = {
    jointCount: 2
};

export default class PolylineLinkDrawing extends Drawing implements IPolylineLinkDrawing {
    constructor(option: PolylineLinkDrawingOption) {
        const opt = merge(DefaultPolylineLinkDrawingOption, option || {});
        if (opt.jointCount < 1) {
            throw new Error(`jointCount 必须>=1`);
        }
        super(opt);
        this.from = opt.from;
        this.to = opt.to;
        this.jointCount = opt.jointCount;
        this.joints = [];
        this.links = [];
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

    _getJointPosition(): Array<Point> {
        const [fromAnchor, toAnchor] = this._getAllAnchors();
        const fromPosition = fromAnchor.getPosition();
        const toPosition = toAnchor.getPosition();
        const ex = Math.abs(fromPosition.x - toPosition.x) / (this.jointCount + 1);
        const ey = Math.abs(fromPosition.y - toPosition.y) / (this.jointCount + 1);
        let result = [];
        for (let i = 1; i < this.jointCount + 1; i++) {
            result.push({
                x: fromPosition.x + ex * i,
                y: toPosition.y + ey * i
            })
        }
        return result;
    }

    initialize(...args) {
        super.initialize(...args);
        const jointPosition = this._getJointPosition();
        for (let i = 0; i < this.jointCount; i++) {
            this.joints.push(new JointDrawing({
                attrs: {
                    cx: jointPosition[i].x,
                    cy: jointPosition[i].y
                }
            }));
        }
        this.joints.forEach((joint: IJointDrawing) => {
            joint.initialize(...args);
            console.log(joint.getPosition());
        });
        const [fromAnchor, toAnchor] = this._getAllAnchors();
        for (let i = 0; i < this.joints.length + 1; i++) {
            if (i === 0) {
                this.links.push(new AnchorLinkDrawing({
                    from: fromAnchor,
                    to: this.joints[i]
                }))
            }
            else if (i === this.joints.length) {
                this.links.push(new AnchorLinkDrawing({
                    from: this.joints[i - 1],
                    to: toAnchor
                }))
            }
            else {
                this.links.push(new AnchorLinkDrawing({
                    from: this.joints[i - 1],
                    to: this.joints[i]
                }))
            }
        }
        this.links.forEach((link: IAnchorLinkDrawing) => link.initialize(...args));
    }

    render() {
        this.links.forEach((link: IAnchorLinkDrawing) => link.render());
        this.joints.forEach((joint: IJointDrawing) => joint.render());
    }

    remove() {
        super.remove();
        this.links.forEach((link: IAnchorLinkDrawing) => link.remove());
        this.joints.forEach((joint: IJointDrawing) => joint.remove());
    }

    getTextPosition(): Point {
        //TODO
        return {x: 0, y: 0}
    }

    findDrawingByID(id) {
        if (this.id === id) {
            return [this];
        }
        else {
            return this.joints.find(f => f.id === id);
        }
    }

}