import * as React from "react"
import {render} from "react-dom"
import Svg from "../component/Svg"
import Drawing from "../component/Drawing"

function App() {
    return (
        <Svg>
            <Drawing x={100} y={100} anchors={[{x: 0, y: -50}, {x: 50, y: 0}]}>
                <rect x={-50} y={-50} width={100} height={100} fill="transparent" stroke="red"></rect>
            </Drawing>
        </Svg>
    )
}

render(<App></App>, document.querySelector("#app"));