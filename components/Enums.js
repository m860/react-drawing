"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var LinkDrawingModeType = exports.LinkDrawingModeType = {
    line: 0,
    lineWithArrow: 1,
    multipleLine: 2
};

var ActionEnum = exports.ActionEnum = {
    /**绘画*/
    draw: "draw",
    /**重绘/更新*/
    redraw: "redraw",
    /**选择*/
    select: "select",
    /**反选*/
    unselect: "unselect",
    /**删除*/
    delete: "delete",
    /**清除所有图形*/
    clear: "clear",
    /**移动*/
    move: "move",
    // undo: "undo",
    // /**绘画*/
    // data: "data",
    /**输入*/
    input: "input"
};

var SelectModeEnum = exports.SelectModeEnum = {
    single: "single",
    multiple: "multiple"
};

var CoordinateEnum = exports.CoordinateEnum = {
    "screen": "screen",
    "math": "math"
};

var GraphEnum = exports.GraphEnum = {
    none: "none",
    draw: "draw",
    playing: "playing"
};