import React, { Component } from 'react';
import './autosuggest.css';

class CollaratorsList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getUsersDiv = this.getUsersDiv.bind(this);
        this.getSuggests = this.getSuggests.bind(this);
    }

    getUsersDiv() {
        let res = [];
        let list = this.props.list;
        if (list) {
            res = list.map(user => {
                if (!user.image_url)
                    user.image_url =
                        'https://upload.wikimedia.org/wikipedia/commons/3/3c/Cc-by_new.svg';
                return (
                    <div className="col-lg-3 col-md-4 col-sm-6">
                        <div className="row align-items-center mb-2">
                            <img
                                className="mr-4 rounded-circle"
                                src={user.image_url}
                                alt="userIcon"
                                style={{ width: '2em', height: '2em' }}
                            />{' '}
                            {user.username}
                        </div>
                    </div>
                );
            });
        }
        return res;
    }

    getSuggests() {
        let input = this.state.input;
        if (!input) return null;
        let text = input.value;
        if (text.length < 1) {
            this.setState({ suggestsDivList: [] });
            return null;
        }
        fetch('/api/user/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: text }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    console.log('Search result: ', data);
                    let usersList = data.userList.map(user => {
                        if (!user.imageurl)
                            user.imageurl =
                                'https://upload.wikimedia.org/wikipedia/commons/3/3c/Cc-by_new.svg';
                        return (
                            <li
                                className="list-group-item list-group-item-action d-flex align-items-center"
                                style={{ cursor: 'pointer', zIndex: 15 }}
                                onClick={() => {
                                    this.state.input.value = user.username;
                                    this.getSuggests();
                                    this.setState({ suggest: false });
                                }}
                            >
                                <img
                                    className="rounded-circle mr-4"
                                    src={user.image_url}
                                    style={{ width: '2em', height: '2em' }}
                                />
                                {user.username}
                            </li>
                        );
                    });
                    let result = (
                        <ul className="list-group list-group-flush text-dark">
                            {usersList}
                        </ul>
                    );
                    this.setState({ suggestsDivList: result });
                }
            });
    }

    componentDidMount() {
        this.setState({ input: document.getElementById('search-collab') });
    }

    render() {
        let usersDiv = this.getUsersDiv();
        return (
            <div id="collaborators-div" className="col-12 mb-4">
                <h2>Collaborateurs:</h2>
                <div className="row">
                    <div className="col-lg-3 col-md-5 col-sm-12">
                        <input
                            type="text"
                            className="form-control form-control-lg form-group"
                            id="search-collab"
                            placeholder="Ajouter un collaborateur"
                            onChange={this.getSuggests}
                            onFocus={() => this.setState({ suggest: true })}
                        />
                        <div
                            className="rounded-bottom"
                            style={{
                                position: 'absolute',
                                height: this.state.suggest ? '' : '0',
                                overflow: 'hidden',
                                transitionDuration: '0.5s',
                                top:
                                    this.state.input &&
                                    this.state.input.clientHeight - 8,
                                width:
                                    this.state.input &&
                                    this.state.input.clientWidth,
                                zIndex: 10,
                            }}
                        >
                            {this.state.suggestsDivList}
                        </div>
                    </div>
                    <div className="col-auto">
                        <button
                            className="btn btn-lg btn-primary"
                            onClick={() =>
                                this.props.fallback(this.state.input.value)
                            }
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
                <div className="row ml-5">{usersDiv}</div>
            </div>
        );
    }
}

export default CollaratorsList;
