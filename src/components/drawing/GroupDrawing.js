import TagDrawing from "./TagDrawing";
import type {DrawingType, GroupOption, IDrawing, IGroupDrawing, Point} from "../Types";
import merge from "deepmerge"
import Drawings from "./index"
import Drawing from "./Drawing";

export default class GroupDrawing extends Drawing implements IGroupDrawing {
    constructor(option: GroupOption) {
        super(option);
        if (!option.drawings) {
            throw new Error("option.drawings is required");
        }
        this.drawings = option.drawings.map((drawing: DrawingType) => {
            const func = Drawings[drawing.type];
            if (!func) {
                throw new Error(`${drawing.type} is not defined`);
            }
            return new func(drawing.option);
        });
    }

    initialize(...args) {
        super.initialize(...args);
        this.drawings.forEach((drawing: IDrawing) => drawing.initialize(...args));
    }

    // render(nextArrts = {}) {
    //     super.render(nextArrts);
    //     this.drawings.forEach((drawing: IDrawing) => drawing.render());
    // }

    remove() {
        this.drawings.forEach((drawing: IDrawing) => drawing.remove());
        super.remove();
    }

    moveTo(vec: Point) {
        this.drawings.forEach((drawing: IDrawing) => drawing.moveTo(vec));
    }

}