import * as React from "react"
import Anchor from "./Anchor";

type Props = {
    x: number,
    y: number,
    anchors?: Array
};

export default class Drawing extends React.PureComponent<Props> {
    static defaultProps = {
        anchors: []
    };

    getPosition(tag) {
        if (tag.type === "line") {
            return {
                x1: this.props.x + tag.props.x1,
                y1: this.props.y + tag.props.y1,
                x2: this.props.x + tag.props.x2,
                y2: this.props.y + tag.props.y2
            }
        }
        else if (tag.type === "circle") {
            return {
                cx: this.props.x + tag.props.cx,
                cy: this.props.y + tag.props.cy
            }
        }
        else if (tag.type === "text" || tag.type === "rect" || tag.type === "image") {
            return {
                x: this.props.x + tag.props.x,
                y: this.props.y + tag.props.y
            };
        }
        else if (tag.type === "ellipse") {
            return {
                cx: this.props.x + tag.props.cx,
                cy: this.props.y + tag.props.cy,
                rx: this.props.x + tag.props.rx,
                ry: this.props.y + tag.props.ry
            }
        }
        return {};
    }

    renderChildren() {
        if (this.props.children instanceof Array) {
            return this.props.children.map((children, index) => {
                return React.cloneElement(children, {
                    ...this.getPosition(children),
                    key: `${children.type}-${index}`
                })
            })
        }
        return React.cloneElement(this.props.children, {
            ...this.getPosition(this.props.children)
        });
    }

    renderAnchors() {
        return this.props.anchors.map((anchor, index) => {
            return <Anchor x={this.props.x + anchor.x} y={this.props.y + anchor.y} key={`anchor-${index}`}/>
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.renderChildren()}
                {this.renderAnchors()}
            </React.Fragment>
        );
    }
}
