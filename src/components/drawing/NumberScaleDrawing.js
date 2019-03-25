import Drawing from "./Drawing";
import type {INumberScaleDrawing, NumberScaleOption} from "../Types";
import merge from "deepmerge"
import * as d3 from 'd3'

const DefaultNumberScaleOption: NumberScaleOption = {
    original: {
        x: 20,
        y: 280
    },
    xAxisLength: 360,
    yAxisLength: 260,
    scale: 20
};

export default class NumberScaleDrawing extends Drawing implements INumberScaleDrawing {
    constructor(option: NumberScaleOption) {
        const opt = merge(DefaultNumberScaleOption, option || {});
        super(opt);
        this.original = option.original;
        this.xAxisLength = option.xAxisLength;
        this.yAxisLength = option.yAxisLength;
        this.scale = option.scale
    }

    initialize(...args) {
        super.initialize(...args);
        this.selection = d3.select(this.graph.ele).append("g");
        const xEndPoint = {
            x: this.original.x + this.xAxisLength,
            y: this.original.y
        };// new Point(this.original.x + this.xAxisLength, this.original.y);
        const yEndPoint = {
            x: this.original.x,
            y: this.original.y - this.yAxisLength
        };// new Point(this.original.x, this.original.y - this.yAxisLength)
        //xAxis
        this.selection.append("line")
            .attr("x1", this.original.x)
            .attr("y1", this.original.y)
            .attr("x2", xEndPoint.x)
            .attr("y2", xEndPoint.y)
            .attr("stroke", "black")
            .attr("stroke-width", "1px");
        //画x轴的箭头
        this.selection.append("path")
            .attr("d", `M ${xEndPoint.x} ${xEndPoint.y} L ${xEndPoint.x} ${xEndPoint.y + 5} L ${xEndPoint.x + 15} ${xEndPoint.y} L ${xEndPoint.x} ${xEndPoint.y - 5} Z`)
        // 画x轴的刻度
        const xScaleCount = Math.floor(Math.abs(xEndPoint.x - this.original.x) / this.scale);
        let preTextPositionWithX = 0;
        Array.apply(null, {length: xScaleCount}).forEach((v, i) => {
            const p1 = {
                x: this.original.x + this.scale * i,
                y: this.original.y
            };// new Point(originalPoint.x + this.scale * i, originalPoint.y);
            const p2 = {
                x: this.original.x + this.scale * i,
                y: this.original.y - 3
            };// new Point(originalPoint.x + this.scale * i, originalPoint.y - 3)
            this.selection.append("line")
                .attr("x1", p1.x)
                .attr("y1", p1.y)
                .attr("x2", p2.x)
                .attr("y2", p2.y)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            const dis = p1.x - preTextPositionWithX;
            if (dis >= 20) {
                preTextPositionWithX = p1.x;
                this.selection.append("text")
                    .text(i)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("x", p1.x)
                    .attr("y", p1.y + 10)
                    .attr("style", "font-size:10px");
            }
        })
        //yAxis
        this.selection.append("line")
            .attr("x1", this.original.x)
            .attr("y1", this.original.y)
            .attr("x2", yEndPoint.x)
            .attr("y2", yEndPoint.y)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
        //画y轴的箭头
        this.selection.append("path")
            .attr("d", `M ${yEndPoint.x} ${yEndPoint.y} L ${yEndPoint.x + 5} ${yEndPoint.y} L ${yEndPoint.x} ${yEndPoint.y - 15} L ${yEndPoint.x - 5} ${yEndPoint.y} Z`)
        //画y轴的刻度
        const yScaleCount = Math.floor(Math.abs(yEndPoint.y - this.original.y) / this.scale);
        let preTextPositionWithY = this.original.y;
        Array.apply(null, {length: yScaleCount}).forEach((v, i) => {
            const p1 = {
                x: this.original.x,
                y: this.original.y - this.scale * i
            };//new Point(this.original.x, this.original.y - this.scale * i);
            const p2 = {
                x: this.original.x + 3,
                y: this.original.y - this.scale * i
            };// new Point(this.original.x + 3, this.original.y - this.scale * i)
            this.selection.append("line")
                .attr("x1", p1.x)
                .attr("y1", p1.y)
                .attr("x2", p2.x)
                .attr("y2", p2.y)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            const dis = preTextPositionWithY - p1.y;
            if (dis >= 20) {
                preTextPositionWithY = p1.y;
                this.selection.append("text")
                    .text(i)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("x", p1.x - 15)
                    .attr("y", p1.y)
                    .attr("style", "font-size:10px");
            }
        })
    }

    getPosition() {
        return null;
    }
}