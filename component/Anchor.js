import * as React from "react"

export default class Anchor extends React.PureComponent {
    render() {
        return <rect x={this.props.x - 3} y={this.props.y - 3} width={6} height={6} fill="black" stroke="black"></rect>
    }
}