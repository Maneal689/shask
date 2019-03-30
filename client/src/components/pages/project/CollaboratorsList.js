import React, { Component } from 'react';

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
                    <div className="col-xl-2 col-lg-3 col-md-4 col-12 align-items-center">
                        <div className="d-flex align-items-center justify-content-between justify-content-md-start mb-2">
                            <img
                                className="mr-4 rounded-circle"
                                src={user.image_url}
                                alt="userIcon"
                                style={{ width: '2em', height: '2em' }}
                            />{' '}
                            {user.username}
                            {this.props.creator === 1 &&
                                this.props.myId !== user.id_user && (
                                    <button
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() =>
                                            this.props.removeCollab(
                                                user.id_user
                                            )
                                        }
                                    >
                                        <i className="fas fa-times" />
                                    </button>
                                )}
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
                    let usersList = data.userList.map(user => {
                        if (!user.image_url)
                            user.image_url =
                                'https://upload.wikimedia.org/wikipedia/commons/3/3c/Cc-by_new.svg';
                        return <option value={user.username} />;
                    });
                    this.setState({ suggestsDivList: usersList });
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
                {this.props.creator === 1 && (
                    <div className="row">
                        <div className="col-lg-3 col-md-5 col-12">
                            <input
                                type="text"
                                list="datalistColSuggests"
                                className="form-control form-control-lg form-group"
                                id="search-collab"
                                placeholder="Ajouter un collaborateur"
                                onChange={this.getSuggests}
                            />
                            <datalist id="datalistColSuggests">
                                {this.state.suggestsDivList}
                            </datalist>
                        </div>
                        <div className="col-12 col-md-auto">
                            <button
                                className="btn btn-lg btn-info mb-2"
                                onClick={() =>
                                    this.props.fallback(this.state.input.value)
                                }
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                )}
                <div className="row">{usersDiv}</div>
            </div>
        );
    }
}

export default CollaratorsList;
