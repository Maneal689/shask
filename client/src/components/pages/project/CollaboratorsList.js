import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addCollaborator } from '../../../redux/actions';
import { removeCollaborator } from '../../../redux/actions';

class CollaratorsList extends Component {
    constructor(props) {
        super(props);
        this.state = { input: '', suggests: [] };
        this.getUsersDiv = this.getUsersDiv.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addCollaborator = this.addCollaborator.bind(this);
        this.removeCollaborator = this.removeCollaborator.bind(this);
    }

    getUsersDiv() {
        let res = [];
        let list = this.props.collaboratorsList;
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
                                            this.removeCollaborator(
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

    handleChange(e) {
        let input = e.target.value;
        this.setState({input});
        if (input.length < 1) {
            this.setState({ suggests: [] });
            return null;
        }
        fetch('/api/user/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: input }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK')
                    this.setState({ suggests: data.userList });
            });
    }

    addCollaborator(username) {
        if (username && username.length > 0) {
            fetch('/api/project/' + this.props.projectId + '/addCollaborator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'OK')
                        this.props.addCollaborator(data.userInfo);
                });
        }
    }

    removeCollaborator(id_user) {
        let url =
            '/api/project/' +
            this.props.projectId +
            '/removeCollaborator?id=' +
            id_user;
        fetch(url, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK')
                    this.props.removeCollaborator(id_user);
            });
    }

    render() {
        let usersDiv = this.getUsersDiv();
        return (
            <div id="collaborators-div" className="col-12 mb-4">
                <h2 className="">Collaborateurs:</h2>
                {this.props.creator === 1 && (
                    <div className="row">
                        <div className="col-lg-3 col-md-5 col-12">
                            <input
                                type="text"
                                list="datalistColSuggests"
                                className="form-control form-control-lg form-group"
                                placeholder="Ajouter un collaborateur"
                                value={this.state.input}
                                onChange={this.handleChange}
                            />
                            <datalist id="datalistColSuggests">
                                {this.state.suggests.map(user => (
                                    <option value={user.username} />
                                ))}
                            </datalist>
                        </div>
                        <div className="col-12 col-md-auto">
                            <button
                                className="btn btn-lg btn-info mb-2"
                                onClick={() =>
                                    this.addCollaborator(this.state.input)
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

function mapStateToProps(state) {
    return {
        collaboratorsList: state.collaboratorsList,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        addCollaborator: userInfo => dispatch(addCollaborator(userInfo)),
        removeCollaborator: userId => dispatch(removeCollaborator(userId)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CollaratorsList);
