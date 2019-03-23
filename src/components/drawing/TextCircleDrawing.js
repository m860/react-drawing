import type {ITextCircleDrawing, Point, TextCircleOption} from "../Types";
import CircleDrawing from "./CircleDrawing";
import TextDrawing from "./TextDrawing";

export default class TextCircleDrawing extends CircleDrawing implements ITextCircleDrawing {
    constructor(option: TextCircleOption) {
        if (!option.textOption) {
            throw new Error(`option.textOption and option.circleOption is required`);
        }
        super(option);
        this.textDrawing = new TextDrawing(option.textOption);
    }

    initialize(...args) {
        super.initialize(...args);
        this.textDrawing.initialize(...args);
    }

    render(...args) {
        super.render(...args);
        const position = this.getPosition();
        this.textDrawing.render({x: position.x, y: position.y})
    }

    moveTo(vec: Point) {
        super.moveTo(vec);
        const position = this.getPosition();
        this.textDrawing.render({x: position.x, y: position.y});
    }

}