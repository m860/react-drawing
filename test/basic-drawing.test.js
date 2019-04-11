import * as React from "react"
import renderer from "react-test-renderer"
import Svg from "../component/Svg";
import Drawing from "../component/Drawing";


test(`Drawing line`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <line x1={-50} y1={0} x2={50} y2={0} fill="black" stroke="black"></line>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test(`Drawing two line`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <line x1={-50} y1={0} x2={50} y2={0} fill="black" stroke="black"></line>
                <line x1={0} y1={-50} x2={0} y2={50} fill="black" stroke="black"></line>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test(`Drawing circle`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <circle cx={0} cy={0} r={10} fill="black" stroke="black"></circle>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test(`Drawing text`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <text x={0} y={0} fill="black" stroke="black">abc</text>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test(`Drawing rect`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <rect x={-50} y={-50} width={100} height={100} fill="black" stroke="black"></rect>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test(`Drawing image`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <image x={0} y={0}></image>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test(`Drawing ellipse`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100}>
                <ellipse cx={0} cy={0} rx={10} ry={10}></ellipse>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
