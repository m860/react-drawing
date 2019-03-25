import type {AnchorDrawingOption, DrawingOption, IAnchorDrawing, IDrawing, PathType, Point} from "../Types";
import UUID from "uuid/v1";
import deepcopy from "deepcopy"
import {SelectAction} from "../D3Graph";
import merge from "deepmerge"
import DrawingEmitter from "./DrawingEmitter";

export default class Drawing implements IDrawing {
    constructor(option: DrawingOption) {
        this.id = option.id ? option.id : UUID();
        this.attrs = option.attrs;
        this.selectedAttrs = option.selectedAttrs;
        this.text = option.text;
        this.ready = false;
        this.selected = false;
        if (option.anchors && option.anchors.length > 0) {
            const AnchorDrawing = require("./AnchorDrawing").default;
            this.anchors = option.anchors.map((anchorOpt: AnchorDrawingOption) => {
                return new AnchorDrawing(anchorOpt);
            });
        }
        else {
            this.anchors = [];
        }
        this.listeners = [];
        this.type = this.constructor.name;
    }

    applyAttrs(attrs = {}) {
        if (this.selection) {
            this.selection.call(self => {
                for (let key in attrs) {
                    if (["x", "x1", "x2", "cx"].indexOf(key) >= 0) {
                        self.attr(key, this.graph.toScreenX(attrs[key]));
                    }
                    else if (["y", "y1", "y2", "cy"].indexOf(key) >= 0) {
                        self.attr(key, this.graph.toScreenY(attrs[key]));
                    }
                    else {
                        self.attr(key, attrs[key]);
                    }
                }
            });
            this.selection.attr("shape-id", this.id);
            this.selection.attr("shape-type", this.type);
            this.text && this.selection.text(this.text);
        }
    }

    initialize(graph) {
        this.graph = graph;
        this.ready = true;
        //initial AnchorDrawing
        this.anchors.forEach((anchor: IAnchorDrawing) => anchor.initialize(graph));
    }

    render(nextAttrs = {}) {
        const attrs = merge.all([this.attrs || {}, this.selected ? this.selectedAttrs : {}, nextAttrs]);
        this.applyAttrs(attrs);
        const position = this.getPosition();
        this.anchors.forEach((anchor: IAnchorDrawing) => {
            const anchorOffset = anchor.getOffset();
            anchor.render({
                cx: position.x + anchorOffset.x,
                cy: position.y + anchorOffset.y
            })
        })
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
        this.listeners.forEach(listener => listener.remove());
        this.anchors.forEach(anchor => anchor.remove());
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

    findAnchor(id) {
        return this.anchors.find(f => f.id === id);
    }

    once(name, callback) {
        const listener = DrawingEmitter.once(name, callback);
        this.listeners.push(listener);
    }

    addListener(name, callback) {
        const listener = DrawingEmitter.addListener(name, callback);
        console.log(`listen : ${name}`);
        this.listeners.push(listener);
    }

    emit(name, data) {
        console.log(`emit : ${name}`)
        DrawingEmitter.emit(name, data);
    }

    formatPath(data) {
        const arr = data.map((item: PathType) => {
            if ((item.x === null || item.x === undefined) || (item.y === null || item.y === undefined)) {
                return item.action;
            }
            return `${item.action} ${this.graph.toScreenX(item.x)} ${this.graph.toScreenY(item.y)}`
        });
        return arr.join(" ");
    }

    findDrawingByID(id) {
        if (this.id === id) {
            return this;
        }
        return null;
    }
}