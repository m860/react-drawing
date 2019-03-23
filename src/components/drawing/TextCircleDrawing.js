import GroupDrawing from "./GroupDrawing";
import type {GroupOption, Point, TextCircleOption} from "../Types";
import CircleDrawing from "./CircleDrawing";
import TextDrawing from "./TextDrawing";

/**
 * @TODO 实现移动操作
 */
export default class TextCircleDrawing extends GroupDrawing {
    constructor(option: TextCircleOption) {
        if (!option.textOption || !option.circleOption) {
            throw new Error(`option.textOption and option.circleOption is required`);
        }
        const opt: GroupOption = {
            drawings: [{
                type: "TextDrawing",
                option: option.textOption
            }, {
                type: "CircleDrawing",
                option: option.circleOption
            }]
        };
        super(opt);
    }

    render(nextAttrs = {}) {
        super.render(nextAttrs);
        const [text, circle] = this.drawings;
        circle.render();
        const textPosition = circle.getPosition();
        text.render({
            x: textPosition.x,
            y: textPosition.y
        });
    }

    getPosition() {
        const [text, circle] = this.drawings;
        return circle.getPosition();
    }

    moveTo(vec: Point) {
        const [text, circle] = this.drawings;
        const position = this.getPosition();
        const x = position.x + vec.x;
        const y = position.y + vec.y;
        circle.render({
            cx: x,
            cy: y
        });
        text.render({x, y});
    }

}