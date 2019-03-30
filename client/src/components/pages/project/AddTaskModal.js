import React, { Component } from 'react';
import StarRating from '../StarRating';

class AddTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                className="modal fade text-dark"
                id="addTaskModal"
                role="dialog"
                aria-hidden="true"
            >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
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
                                <textarea
                                    className="form-control form-control-lg form-group"
                                    id="descInputModal"
                                    placeholder="Description"
                                />
                                <input
                                    type="text"
                                    className="form-control form-control-lg form-group"
                                    id="sectionInputModal"
                                    placeholder="Section"
                                    list="sectionSuggestList"
                                />
                                <datalist id="sectionSuggestList">
                                    {this.props.sectionsList.map(section => (
                                        <option value={section} />
                                    ))}
                                </datalist>
                                <StarRating
                                    id="starRating1"
                                    desc="Priorité: "
                                    nbStar={5}
                                    color="#17A2B8"
                                    editable={true}
                                    default={0}
                                />
                                <StarRating
                                    id="starRating2"
                                    desc="Difficulté: "
                                    nbStar={5}
                                    color="#FF770F"
                                    editable={true}
                                    default={0}
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
                                    let taskInfo = {};
                                    taskInfo.priority = document.getElementById(
                                        'starRating1'
                                    ).value;
                                    taskInfo.difficulty = document.getElementById(
                                        'starRating2'
                                    ).value;
                                    taskInfo.description = document.getElementById(
                                        'descInputModal'
                                    ).value;
                                    if (taskInfo.description)
                                        taskInfo.description = taskInfo.description.trim();
                                    taskInfo.section = document.getElementById(
                                        'sectionInputModal'
                                    ).value;
                                    if (taskInfo.section)
                                        taskInfo.section = taskInfo.section.trim();
                                    if (taskInfo.section.length === 0)
                                        taskInfo.section = undefined;
                                    if (taskInfo.description.length <= 1) {
                                        let descInput = document.getElementById(
                                            'descInputModal'
                                        );
                                        if (
                                            !descInput.classList.contains(
                                                'is-invalid'
                                            )
                                        )
                                            descInput.classList.add(
                                                'is-invalid'
                                            );
                                    } else {
                                        this.props.fallback(taskInfo);
                                    }
                                }}
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddTaskModal;
