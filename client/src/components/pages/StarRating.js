import React, { Component } from 'react';

class StarRating extends Component {
    constructor(props) {
        super(props);
        this.state = { hovered: -1 };
    }

    render() {
        let starList = [];
        let checkedStyle = { color: this.props.color, cursor: 'pointer' };
        for (let i = 0; i < this.props.nbStar; i++)
            if (this.props.editable)
                starList.push(
                    <i
                        className={
                            i < this.props.default
                                ? 'fas fa-star'
                                : 'far fa-star'
                        }
                        style={
                            i < this.props.default || this.state.hovered >= i
                                ? checkedStyle
                                : { cursor: 'pointer' }
                        }
                        onMouseEnter={() => this.setState({ hovered: i })}
                        onMouseLeave={() => this.setState({ hovered: -1 })}
                        onClick={() => {
                            this.props.fallback(i + 1);
                        }}
                    />
                );
            else
                starList.push(
                    <i
                        className={
                            i < this.props.default
                                ? 'fas fa-star'
                                : 'far fa-star'
                        }
                        style={
                            i < this.props.default
                                ? { color: this.props.color }
                                : {}
                        }
                    />
                );
        return <div title={this.props.title} className="text-dark">{starList}</div>;
    }
}

export default StarRating;
