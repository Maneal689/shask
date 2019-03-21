import React, { Component } from 'react';

import CollaboratorList from './CollaboratorList';
import ProjectsList from './ProjectsList';

class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
        this.createProject = this.createProject.bind(this);
    }

    componentDidMount() {
        fetch('/api/user/me', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    this.setState(data.infos);
                } else {
                    document.location.href = '/';
                }
            });
    }

    logout() {
        fetch('/api/user/logout', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') document.location.href = '/';
            });
    }

    createProject(title) {
        fetch('/api/project/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK')
                    document.location.href = '/project/' + data.id_project;
            });
    }

    render() {
        return (
            <div className="min-vh-100">
                <button
                    type="button"
                    className="btn btn-large btn-light rounded-circle"
                    style={{
                        position: 'fixed',
                        right: '50px',
                        bottom: '50px',
                        zIndex: 1000,
                    }}
                    onClick={() => {
                        let projectTitle = window.prompt("Titre du projet:");
                        if (projectTitle && projectTitle.length > 0)
                            this.createProject(projectTitle);
                    }}
                >
                    +
                </button>
                <div className="row">
                    <div className="navbar col-12">
                        <button onClick={this.logout}>Déconnexion</button>
                    </div>
                </div>
                <div className="row">
                    <div
                        id="collaborators-pan"
                        className="col-lg-3 col-md-5 col-sm-12"
                    >
                        <CollaboratorList
                            friendsIdList={this.state.friendsIdList}
                            projectsIdList={this.state.projectsIdList}
                            myId={this.state.me && this.state.me.id_user}
                        />
                    </div>
                    <div className="col">
                        <ProjectsList
                            projectsIdList={this.state.projectsIdList}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;
