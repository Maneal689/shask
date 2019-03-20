import React, { Component } from 'react';

class StarRating extends Component {
    constructor(props) {
        super(props);
        let checkedList = [];
        for (let i = 0; i < this.props.nbStar; i++) {
            checkedList.push(
                this.props.default ? (i < this.props.default) : false
            );
        }
        this.props.default = undefined;
        this.state = { checkedList, hovered: -1 };
    }

    componentDidUpdate() {
        if (this.props.editable) {
            let me = document.getElementById(this.props.id);
            if (this.props.default) {
                let checkedList = [];
                for (let i = 0; i < this.props.nbStar; i++)
                    checkedList.push(i < this.props.default);
                me.value = this.props.default;
                this.props.default = undefined;
                this.setState({ checkedList });
            } else {
                let value = this.state.checkedList.lastIndexOf(true) + 1;
                me.value = value;
            }
        }
    }

    render() {
        let starList = [];
        let checkedStyle = { color: this.props.color, cursor: 'pointer' };
        for (let i = 0; i < this.props.nbStar; i++)
            if (this.props.editable)
                starList.push(
                    <i
                        className={
                            this.state.checkedList[i]
                                ? 'fas fa-star'
                                : 'far fa-star'
                        }
                        style={
                            this.state.checkedList[i] || this.state.hovered >= i
                                ? checkedStyle
                                : { cursor: 'pointer' }
                        }
                        onMouseEnter={() => this.setState({ hovered: i })}
                        onMouseLeave={() => this.setState({ hovered: -1 })}
                        onClick={() => {
                            let checkedList = this.state.checkedList;
                            for (let j = 0; j < this.props.nbStar; j++) {
                                checkedList[j] = false;
                                if (j <= i) checkedList[j] = true;
                            }
                            this.setState({ checkedList });
                        }}
                    />
                );
            else
                starList.push(
                    <i
                        className={
                            this.state.checkedList[i]
                                ? 'fas fa-star'
                                : 'far fa-star'
                        }
                        style={
                            this.state.checkedList[i] || this.state.hovered >= i
                                ? { color: this.props.color }
                                : {}
                        }
                    />
                );
        return (
            <div
                id={this.props.id}
                className={
                    this.props.className ||
                    'd-flex flex-row justify-content-between'
                }
            >
                {this.props.desc && <div>{this.props.desc}</div>}
                <div>{starList}</div>
            </div>
        );
    }
}

export default StarRating;
