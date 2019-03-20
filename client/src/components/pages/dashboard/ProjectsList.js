import React, { Component } from 'react';

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.projectCard = this.projectCard.bind(this);
        this.getProjectsTabList = this.getProjectsTabList.bind(this);
    }

    projectCard(data) {
        if (data) {
            let nbTasks = data.tasksList.length;
            let nbTasksChecked = data.tasksList.reduce(
                (acc, elm) => acc + elm.checked,
                0
            );
            let percent = (nbTasksChecked / nbTasks) * 100;
            return (
                <a
                    className="list-group-item list-group-item-action bg-dark text-light"
                    href={(() => '/project/' + data.id_project)()}
                >
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between">
                            <h4>{data.title}</h4>
                            <span>
                                {nbTasksChecked}/{nbTasks}
                            </span>
                        </div>
                        <div class="progress">
                            <div
                                class="progress-bar bg-info"
                                role="progressbar"
                                style={{ width: percent + '%' }}
                                aria-valuenow={percent}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            />
                        </div>
                    </div>
                </a>
            );
        }
        return <div />;
    }

    componentDidUpdate() {
        if (!this.state.projectsList && this.props.projectsIdList) {
            this.setState({ projectsList: [] });
            for (let id of this.props.projectsIdList) {
                fetch('/api/project/' + id + '/allInfos', { method: 'GET' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'OK') {
                            let projectInfo = data.infos;
                            let projectsList = this.state.projectsList;
                            projectsList.push(projectInfo);
                            this.setState({ projectsList });
                        }
                    });
            }
        }
    }

    getProjectsTabList() {
        let projectsTabList = undefined;
        if (this.state.projectsList)
            projectsTabList = this.state.projectsList.map(elm =>
                this.projectCard(elm)
            );
        return (
            <div className="text-light mb-3 border-0 text-center">
                <h3>Projets</h3>
                <div className="list-group list-group-flush">
                    {projectsTabList || (
                        <div class="list-group-item bg-dark">
                            <div
                                className="spinner-border text-light"
                                role="status"
                            >
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    render() {
        return <div>{this.getProjectsTabList()}</div>;
    }
}

export default Project;
