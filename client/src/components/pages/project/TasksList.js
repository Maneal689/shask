import React, { Component } from 'react';
import $ from 'jquery';
import 'bootstrap';

import Task from './Task';

class TasksList extends Component {
    constructor(props) {
        super(props);
        this.getTasksOfState = this.getTasksOfState.bind(this);
    }

    getTasksOfState(state) {
        let res = [];
        let list = this.props.list.sort((a, b) => b.priority - a.priority);
        for (let task of list.filter(task => task.state === state))
            res.push(<Task taskInfo={task} />);
        return res;
    }

    render() {
        let nbTaskReducer = state => {
            return (acc, task) => acc + (task.state === state ? 1 : 0);
        };
        return (
            <div id="tasks-list" className="col-12">
                <nav>
                    <div className="nav nav-tabs" role="tablist">
                        <a
                            className="nav-item nav-link"
                            data-toggle="tab"
                            href="#nav-state-1"
                            role="tab"
                            aria-selected="true"
                        >
                            Idée{' '}
                            <span className="badge badge-primary">
                                {this.props.list.reduce(nbTaskReducer(1), 0)}
                            </span>
                        </a>
                        <a
                            className="nav-item nav-link active"
                            data-toggle="tab"
                            href="#nav-state-2"
                            role="tab"
                            aria-selected="false"
                        >
                            A faire{' '}
                            <span className="badge badge-primary">
                                {this.props.list.reduce(nbTaskReducer(2), 0)}
                            </span>
                        </a>
                        <a
                            className="nav-item nav-link"
                            data-toggle="tab"
                            href="#nav-state-3"
                            role="tab"
                            aria-selected="false"
                        >
                            En cours{' '}
                            <span className="badge badge-primary">
                                {this.props.list.reduce(nbTaskReducer(3), 0)}
                            </span>
                        </a>
                        <a
                            className="nav-item nav-link"
                            data-toggle="tab"
                            href="#nav-state-4"
                            role="tab"
                            aria-selected="false"
                        >
                            Terminé{' '}
                            <span className="badge badge-primary">
                                {this.props.list.reduce(nbTaskReducer(4), 0)}
                            </span>
                        </a>
                    </div>
                </nav>
                <div className="tab-content">
                    <div
                        className="tab-pane fade"
                        id="nav-state-1"
                        role="tabpanel"
                    >
                        <div className="row">{this.getTasksOfState(1)}</div>
                    </div>
                    <div
                        className="tab-pane fade show active"
                        id="nav-state-2"
                        role="tabpanel"
                    >
                        <div className="row">{this.getTasksOfState(2)}</div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="nav-state-3"
                        role="tabpanel"
                    >
                        <div className="row">{this.getTasksOfState(3)}</div>
                    </div>
                    <div
                        className="tab-pane fade"
                        id="nav-state-4"
                        role="tabpanel"
                    >
                        <div className="row">{this.getTasksOfState(4)}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TasksList;
