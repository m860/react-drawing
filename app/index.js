import * as React from "react"
import {render} from "react-dom"
import Svg from "../component/Svg"
import Drawing from "../component/Drawing"

function App() {
    return (
        <Svg>
            <Drawing x={100} y={100}>
                <line x1={-50} y1={0} x2={50} y2={0} fill="black" stroke="black" strokeWidth={2}></line>
                <line x1={0} y1={-50} x2={0} y2={50} fill="black" stroke="black" strokeWidth={2}></line>
            </Drawing>
        </Svg>
    )
}

render(<App></App>, document.querySelector("#app"));