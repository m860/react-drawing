import React from 'react';
import {storiesOf} from '@storybook/react';
import Svg from "../component/Svg";
import Drawing from "../component/Drawing";

storiesOf("图形绘制", module)
    .add("line", () => {
        return (
            <Svg>
                <Drawing x={150} y={75}>
                    <line x1={-50} y1={0} x2={50} y2={0} strokeWidth={2} stroke="black" fill="black"></line>
                </Drawing>
            </Svg>
        );
    })
    .add("circle", () => {
        return (
            <Svg>
                <Drawing x={150} y={75}>
                    <circle cx={0} cy={0} r={10} strokeWidth={2} stroke="black" fill="red"></circle>
                </Drawing>
            </Svg>
        );
    })
    .add("rect", () => {
        return (
            <Svg>
                <Drawing x={150} y={75}>
                    <rect x={-25} y={-25} width={50} height={50} strokeWidth={2} stroke="black" fill="red"></rect>
                </Drawing>
            </Svg>
        );
    })
    .add("text", () => {
        return (
            <Svg>
                <Drawing x={150} y={75}>
                    <text x={0} y={0} strokeWidth={1} stroke="black" fill="red">abc</text>
                </Drawing>
            </Svg>
        );
    });