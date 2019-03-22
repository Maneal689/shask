import React, { Component } from 'react';

class StarRating extends Component {
    constructor(props) {
        super(props);
        this.state = { hovered: -1 };
    }

    componentDidMount() {
        let me = document.getElementById(this.props.id);
        me.value = 0;
        if (this.props.default) me.value = this.props.default;
        this.setState({ me, value: me.value });
    }

    componentDidUpdate() {
        if (this.props.default) {
            let me = this.state.me;
            me.value = this.props.default;
            this.props.default = undefined;
            this.setState({ me, value: me.value });
        }
    }

    render() {
        let starList = [];
        if (this.state.me) {
            let checkedStyle = { color: this.props.color, cursor: 'pointer' };
            for (let i = 0; i < this.props.nbStar; i++)
                if (this.props.editable)
                    starList.push(
                        <i
                            className={
                                i < this.state.me.value
                                    ? 'fas fa-star'
                                    : 'far fa-star'
                            }
                            style={
                                i < this.state.me.value ||
                                this.state.hovered >= i
                                    ? checkedStyle
                                    : { cursor: 'pointer' }
                            }
                            onMouseEnter={() => this.setState({ hovered: i })}
                            onMouseLeave={() => this.setState({ hovered: -1 })}
                            onClick={() => {
                                this.state.me.value = i + 1;
                                this.setState({ value: this.state.me.value });
                            }}
                        />
                    );
                else
                    starList.push(
                        <i
                            className={
                                i < this.state.me.value
                                    ? 'fas fa-star'
                                    : 'far fa-star'
                            }
                            style={
                                i < this.state.me.value
                                    ? { color: this.props.color }
                                    : {}
                            }
                        />
                    );
        }
        return (
            <div
                id={this.props.id}
                className={
                    this.props.className ||
                    'd-flex flex-row justify-content-between'
                }
            >
                {this.props.desc && <div>{this.props.desc}</div>}
                <div title={this.props.title}>{starList}</div>
            </div>
        );
    }
}

export default StarRating;
