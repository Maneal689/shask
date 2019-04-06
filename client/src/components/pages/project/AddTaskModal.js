import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import StarRating from '../StarRating';
import { configAddModal, addTask } from '../../../redux/actions';

class AddTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = { titleError: false };
        this.addTask = this.addTask.bind(this);
    }

    addTask(taskInfo) {
        fetch('/api/project/' + this.props.projectId + '/addTask', {
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
                    taskInfo.username = this.props.username;
                    this.props.addTask(taskInfo);
                    $('#' + this.props.id).modal('hide');
                    this.props.configAddModal({
                        title: '',
                        description: '',
                        priority: 0,
                        difficulty: 0,
                        state: 1,
                    });
                } else console.error(data);
            });
    }

    render() {
        return (
            <div
                className="modal fade text-dark"
                id={this.props.id}
                role="dialog"
                aria-hidden="true"
            >
                <div class="modal-dialog" role="document">
                    <div class="modal-content bg-light text-dark">
                        <div class="modal-header">
                            <h5 class="modal-title">Ajouter une tâche</h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <input
                                    type="text"
                                    className={(() => {
                                        return (
                                            'form-control form-control-lg form-group' +
                                            (this.state.titleError
                                                ? ' is-invalid'
                                                : '')
                                        );
                                    })()}
                                    placeholder="Titre"
                                    value={this.props.config.title}
                                    onChange={e => {
                                        let title = e.target.value;
                                        this.props.configAddModal({ title });
                                    }}
                                />
                                <textarea
                                    className="form-control form-control-lg form-group"
                                    placeholder="Description"
                                    value={this.props.config.description}
                                    onChange={e => {
                                        let description = e.target.value;
                                        this.props.configAddModal({
                                            description,
                                        });
                                    }}
                                />
                                <div className="form-group">
                                    <label htmlFor="stateInputEditModal">
                                        Etat:
                                    </label>
                                    <select
                                        className="form-control form-control-lg"
                                        onChange={e => {
                                            let state = parseInt(
                                                e.target.value
                                            );
                                            this.props.configAddModal({
                                                state,
                                            });
                                        }}
                                    >
                                        <option
                                            value="1"
                                            selected={
                                                this.props.config.state === 1
                                            }
                                        >
                                            Idée
                                        </option>
                                        <option
                                            value="2"
                                            selected={
                                                this.props.config.state === 2
                                            }
                                        >
                                            A faire
                                        </option>
                                        <option
                                            value="3"
                                            selected={
                                                this.props.config.state === 3
                                            }
                                        >
                                            En cours
                                        </option>
                                        <option
                                            value="4"
                                            selected={
                                                this.props.config.state === 4
                                            }
                                        >
                                            Terminé
                                        </option>
                                    </select>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Priorité:</span>
                                    <StarRating
                                        default={this.props.config.priority}
                                        nbStar={5}
                                        color="#17A2B8"
                                        editable={true}
                                        fallback={val => {
                                            this.props.configAddModal({
                                                priority: val,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Difficulté:</span>
                                    <StarRating
                                        default={this.props.config.difficulty}
                                        nbStar={5}
                                        color="#FF770F"
                                        editable={true}
                                        fallback={val => {
                                            this.props.configAddModal({
                                                difficulty: val,
                                            });
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                class="btn btn-primary"
                                onClick={() => {
                                    let taskInfo = {
                                        id_task: this.props.config.id_task,
                                    };
                                    taskInfo.priority = this.props.config.priority;
                                    taskInfo.difficulty = this.props.config.difficulty;
                                    taskInfo.description = this.props.config.description.trim();
                                    taskInfo.title = this.props.config.title.trim();
                                    taskInfo.state = this.props.config.state;
                                    if (taskInfo.title.length > 1)
                                        this.addTask(taskInfo);
                                    else this.setState({ titleError: true });
                                }}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        config: state.addModalConfig,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        configAddModal: config => dispatch(configAddModal(config)),
        addTask: taskInfo => dispatch(addTask(taskInfo)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddTaskModal);
