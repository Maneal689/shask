import React, { Component } from 'react';
import $ from 'jquery';
import StarRating from '../StarRating';

class EditTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        $('#descInputEditModal').val(this.props.default.description);
        $('#sectionInputEditModal').val(this.props.default.section);
    }

    render() {
        return (
            <div
                className="modal fade text-dark"
                id="editTaskModal"
                role="dialog"
                aria-hidden="true"
            >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editer une tâche</h5>
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
                                <textarea
                                    className="form-control form-control-lg form-group"
                                    id="descInputEditModal"
                                    placeholder="Description"
                                />
                                <input
                                    type="text"
                                    className="form-control form-control-lg form-group"
                                    id="sectionInputEditModal"
                                    placeholder="Section"
                                />
                                <StarRating
                                    id="starRatingEdit1"
                                    desc="Priorité: "
                                    default={this.props.default.priority}
                                    nbStar={5}
                                    color="yellow"
                                    editable={true}
                                />
                                <StarRating
                                    id="starRatingEdit2"
                                    desc="Difficulté: "
                                    default={this.props.default.difficulty}
                                    nbStar={5}
                                    color="red"
                                    editable={true}
                                />
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
                                        id_task: this.props.default
                                            ? this.props.default.id_task
                                            : undefined,
                                        checked: this.props.default
                                            ? this.props.default.checked
                                            : undefined,
                                    };
                                    taskInfo.priority = document.getElementById(
                                        'starRatingEdit1'
                                    ).value;
                                    taskInfo.difficulty = document.getElementById(
                                        'starRatingEdit2'
                                    ).value;
                                    taskInfo.description = document.getElementById(
                                        'descInputEditModal'
                                    ).value.trim();
                                    taskInfo.section = document.getElementById(
                                        'sectionInputEditModal'
                                    ).value.trim();
                                    if (taskInfo.section.length === 0)
                                        taskInfo.section = undefined;
                                    if (taskInfo.description.length <= 1) {
                                        let descInput = document.getElementById(
                                            'descInputEditModal'
                                        );
                                        if (
                                            !descInput.classList.contains(
                                                'is-invalid'
                                            )
                                        )
                                            descInput.classList.add(
                                                'is-invalid'
                                            );
                                    } else this.props.fallback(taskInfo);
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

export default EditTaskModal;
