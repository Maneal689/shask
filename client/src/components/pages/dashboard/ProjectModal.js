import React, { Component } from 'react';

class ProjectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div
                className="modal fade"
                id="createProjectModal"
                role="dialog"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Titre du projet</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <input
                                    type="text"
                                    className="form-control form-control-lg form-group"
                                    id="titleInputModal"
                                    placeholder="Titre"
                                />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    let node = document.getElementById(
                                        'titleInputModal'
                                    );
                                    let title = node.value;
                                    let rgx = /^[a-zA-Z0-9\-\.@_\ ]{1,}$/;
                                    if (rgx.test(title))
                                        this.props.fallback(title);
                                    else {
                                        if (
                                            !node.classList.contains(
                                                'is-invalid'
                                            )
                                        )
                                            node.classList.add('is-invalid');
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

export default ProjectModal;
