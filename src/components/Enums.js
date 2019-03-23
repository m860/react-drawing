export const LinkDrawingModeType = {
    line: 0,
    lineWithArrow: 1,
    multipleLine: 2
};

export const ActionEnum = {
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

export const SelectModeEnum = {
    single: "single",
    multiple: "multiple"
};

export const CoordinateEnum = {
    "screen": "screen",
    "math": "math"
};

export const GraphEnum = {
    none: "none",
    draw: "draw",
    playing: "playing"
};