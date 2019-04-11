import * as React from "react"
import renderer from "react-test-renderer"
import Svg from "../component/Svg";
import Drawing from "../component/Drawing";

test(`Drawing anchors`, () => {
    const component = renderer.create(
        <Svg>
            <Drawing x={100} y={100} anchors={[{x: 0, y: -50}, {x: 50, y: 0}]}>
                <rect x={-50} y={-50} width={100} height={100}></rect>
            </Drawing>
        </Svg>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})