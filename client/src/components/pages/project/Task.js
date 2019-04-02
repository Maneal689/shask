import React, { Component } from 'react';

import StarRating from '../StarRating';
import EditTaskModal from './EditTaskModal';

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let starRatingId1 = 'starRating1Task' + this.props.taskInfo.id_task;
        let starRatingId2 = 'starRating2Task' + this.props.taskInfo.id_task;
        return (
            <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3 p-3"
                style={{ backgroundColor: this.props.taskInfo.color }}
            >
                <div
                    className="border border-info rounded pl-3 pr-3 pt-2 pb-1"
                    style={{ height: '10em', overflowY: 'scroll' }}
                >
                    <strong>{this.props.taskInfo.title}</strong>
                    <hr className="m-2" />
                    <div>
                        <p className="mb-0">
                            {this.props.taskInfo.description}
                        </p>
                        <footer className="blockquote-footer">
                            {this.props.taskInfo.username}
                        </footer>
                    </div>
                    <hr className="m-1" />
                    <div className="d-flex flex-row justify-content-between">
                        <small className="d-flex">
                            Priorité:{' '}
                            <StarRating
                                title="Priorité"
                                nbStar={5}
                                color="#17A2B8"
                                editable={false}
                                default={this.props.taskInfo.priority}
                            />
                        </small>
                        <small className="d-flex">
                            Difficulté:{' '}
                            <StarRating
                                id={starRatingId2}
                                title="Difficulté"
                                nbStar={5}
                                color="#FF770F"
                                editable={false}
                                default={this.props.taskInfo.difficulty}
                            />
                        </small>
                    </div>
                </div>
            </div>
        );
    }
}

export default Task;
