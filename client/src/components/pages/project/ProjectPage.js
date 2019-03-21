import React, { Component } from 'react';
import $ from 'jquery';
import AddTaskModal from './AddTaskModal';
import CollaboratorsList from './CollaboratorsList';
import TasksList from './TasksList';

class ProjectPage extends Component {
    constructor(props) {
        super(props);
        this.state = { id_project: props.match.params.id, init: false };
        this.handleCheck = this.handleCheck.bind(this);
        this.addTask = this.addTask.bind(this);
        this.addCollaborator = this.addCollaborator.bind(this);
        this.removeCollaborator = this.removeCollaborator.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.quitProject = this.quitProject.bind(this);
        this.updateTasksList = this.updateTasksList.bind(this);
    }

    componentWillMount() {
        fetch('/api/user/logged', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status !== 'OK') document.location.href = '/';
            });
    }

    componentDidMount() {
        fetch('/api/project/' + this.state.id_project + '/allInfos', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    let res = data.infos;
                    res.init = true;
                    this.setState(res);
                }
            });
    }

    quitProject() {
        fetch('/api/project/' + this.state.id_project + '/quit', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') document.location.href = '/dashboard';
            });
    }

    deleteProject() {
        fetch('/api/project/' + this.state.id_project + '/delete', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') document.location.href = '/dashboard';
            });
    }

    handleCheck(id) {
        let tasksList = this.state.tasksList;
        tasksList.forEach(task => {
            if (task.id_task === id) task.checked = task.checked === 1 ? 0 : 1;
        });
        fetch('/api/task/' + id + '/toggle', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') this.setState({ tasksList });
                else console.error('Server request failed with: ', data.desc);
            });
    }

    removeTask(id) {
        fetch('/api/task/' + id + '/remove', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    let tasksList = this.state.tasksList;
                    let toRemove = null;
                    for (let i = 0; i < tasksList.length; i++) {
                        if (tasksList[i].id_task === id) toRemove = i;
                    }
                    tasksList.splice(toRemove, 1);
                    this.setState({ tasksList });
                }
            });
    }

    updateTasksList(taskInfo) {
        let tasksList = this.state.tasksList;
        let updated = false;
        if (!taskInfo.checked) taskInfo.checked = 0;
        if (!taskInfo.section) taskInfo.section = null;
        $('#addTaskModal').modal('hide');
        $('#editTaskModal').modal('hide');
        for (let i = 0; i < tasksList.length; i++) {
            if (tasksList[i].id_task === taskInfo.id_task) {
                tasksList[i] = taskInfo;
                updated = true;
            }
        }
        if (!updated) tasksList.push(taskInfo);
        this.setState({ tasksList });
    }

    removeCollaborator(id_user) {
        for (let i = 0; i < this.state.collaboratorsList.length; i++) {
            let collab = this.state.collaboratorsList[i];
            if (collab.id_user === id_user) {
                let url =
                    '/api/project/' +
                    this.state.id_project +
                    '/removeCollaborator?id=' +
                    id_user;
                fetch(url, { method: 'GET' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'OK') {
                            let collaboratorsList = this.state
                                .collaboratorsList;
                            collaboratorsList.splice(i, 1);
                            this.setState(collaboratorsList);
                        }
                    });
            }
        }
    }

    addCollaborator(username) {
        if (username && username.length > 0) {
            fetch(
                '/api/project/' + this.state.id_project + '/addCollaborator',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                }
            )
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'OK') {
                        let collaboratorsList = this.state.collaboratorsList;
                        collaboratorsList.push(data.user);
                        this.setState(collaboratorsList);
                    }
                });
        }
    }

    addTask(taskInfo) {
        fetch('/api/project/' + this.state.id_project + '/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskInfo),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    taskInfo.id_task = data.id_task;
                    this.updateTasksList(taskInfo);
                    $('#addTaskModal').modal('hide');
                    $('#descInputModal').val('');
                    $('#sectionInputModal').val('');
                    document.getElementById('starRating1').value = 0;
                    $('#starRating2').val(0);
                } else console.error(data);
            });
    }

    render() {
        if (!this.state.init) {
            return (
                <div className="col-12 hv-100">
                    <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
        let nbTasks = this.state.tasksList.length;
        let nbTasksChecked = this.state.tasksList.reduce(
            (acc, elm) => acc + elm.checked,
            0
        );
        let percent = (nbTasksChecked / nbTasks) * 100;
        return (
            <div>
                <AddTaskModal fallback={this.addTask} />
                <button
                    type="button"
                    className="btn btn-large btn-light rounded-circle"
                    data-toggle="modal"
                    data-target="#addTaskModal"
                    style={{
                        position: 'fixed',
                        right: '50px',
                        bottom: '50px',
                        zIndex: 1000,
                    }}
                >
                    +
                </button>
                <h1>{this.state.title}</h1>
                <div id="progress-div" className="col-12 mb-4">
                    <div className="d-flex justify-content-between">
                        <h2>Progrès:</h2>
                        {nbTasksChecked}/{nbTasks}
                    </div>
                    <div class="progress" style={{ height: '2em' }}>
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
                <CollaboratorsList
                    creator={this.state.creator}
                    myId={this.state.myId}
                    list={this.state.collaboratorsList}
                    fallback={this.addCollaborator}
                    removeCollab={this.removeCollaborator}
                />
                <TasksList
                    list={this.state.tasksList}
                    fallback={this.handleCheck}
                    removeTask={this.removeTask}
                    updateTasksList={this.updateTasksList}
                />
                {(this.state.creator === 1 && (
                    <div className="row">
                        <button
                            className="btn btn-danger btn-lg"
                            onClick={() => {
                                let conf = window.prompt(
                                    `Entrez le nom du projet ("${
                                        this.state.title
                                    }") pour valider la suppression:`
                                );
                                if (conf && conf === this.state.title)
                                    this.deleteProject();
                            }}
                        >
                            Supprimer le projet
                        </button>
                    </div>
                )) || (
                    <div class="row">
                        <button
                            className="btn btn-danger btn-lg"
                            onClick={() => {
                                let conf = window.prompt(
                                    `Entrez le nom du projet ("${
                                        this.state.title
                                    }") pour valider:`
                                );
                                if (conf && conf === this.state.title)
                                    this.quitProject();
                            }}
                        >
                            Quitter le projet
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default ProjectPage;
