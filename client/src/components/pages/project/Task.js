import React, { Component } from "react";
import { connect } from "react-redux";

import StarRating from "../StarRating";
import EditTaskModal from "./EditTaskModal";
import { configEditModal, removeTask, editTask } from "../../../redux/actions";

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDrag = this.onDrag.bind(this);
  }

  onDrag(e) {
    e.dataTransfer.setData("json", JSON.stringify(this.props.taskInfo));
  }

  render() {
    return (
      <div
        className="col-12 col-sm-6 col-lg-4 col-xl-3 p-3"
        draggable="true"
        onDragStart={this.onDrag}
        style={{
          backgroundColor: this.props.taskInfo.color,
        }}
      >
        <div className="border border-info rounded pl-3 pr-3 pt-2 pb-1">
          <div className="d-flex justify-content-between">
            <strong className="">{this.props.taskInfo.title}</strong>
            <div className="btn-group">
              <button
                data-toggle="modal"
                data-target="#editTaskModal"
                className="btn btn-sm btn-light"
                onClick={() => {
                  this.props.configEditModal(this.props.taskInfo);
                }}
              >
                <i className="fas fa-cog" />
              </button>
              <button
                className="btn btn-sm btn-danger"
                disabled={this.props.myId !== this.props.taskInfo.id_user}
                onClick={() => {
                  let res = window.confirm("Supprimer la tâche?");
                  if (res) {
                    fetch(
                      "/api/task/" + this.props.taskInfo.id_task + "/remove",
                      { method: "GET" }
                    )
                      .then(res => res.json())
                      .then(data => {
                        if (data.status === "OK")
                          this.props.removeTask(this.props.taskInfo.id_task);
                      });
                  }
                }}
              >
                &times;
              </button>
            </div>
          </div>
          <hr className="m-2" />
          <div>
            <p
              className="mb-0"
              style={{
                height: "6em",
                overflowY: "scroll",
              }}
            >
              {this.props.taskInfo.description}
            </p>
            <footer className="blockquote-footer">
              {this.props.taskInfo.username}
            </footer>
          </div>
          <hr className="m-1" />
          <div className="d-flex flex-row justify-content-between">
            <small className="d-flex">
              Priorité:{" "}
              <StarRating
                title="Priorité"
                nbStar={5}
                color="#17A2B8"
                editable={false}
                default={this.props.taskInfo.priority}
              />
            </small>
            <small className="d-flex">
              Difficulté:{" "}
              <StarRating
                title="Difficulté"
                nbStar={5}
                color="#FF770F"
                editable={false}
                default={this.props.taskInfo.difficulty}
              />
            </small>
          </div>
          {this.props.taskInfo.state === 1 && (
            <div class="d-flex justify-content-between align-items-center">
              <div className="btn-group d-flex align-items-center">
                <button
                  className="btn btn-danger btn-sm pr-3 pl-3"
                  disabled={this.props.taskInfo.myVote < 0}
                  onClick={() => {
                    if (this.props.taskInfo.myVote !== -1) {
                      fetch(
                        "/api/task/" +
                          this.props.taskInfo.id_task +
                          "/voteLess",
                        { method: "GET" }
                      )
                        .then(res => res.json())
                        .then(data => {
                          if (data.status === "OK") {
                            let newTask = this.props.taskInfo;
                            if (this.props.taskInfo.myVote !== 0)
                              newTask.voteCount -= 2;
                            else {
                              newTask.totalVote++;
                              newTask.voteCount -= 1;
                            }
                            newTask.myVote = -1;
                            this.props.editTask(newTask);
                          }
                        });
                    }
                  }}
                >
                  -
                </button>
                <span
                  className={
                    this.props.taskInfo.voteCount > 0
                      ? "text-success pl-3 pr-3"
                      : "text-danger pl-3 pr-3"
                  }
                >
                  {this.props.taskInfo.voteCount}
                </span>
                <button
                  className="btn btn-success btn-sm pr-3 pl-3"
                  disabled={this.props.taskInfo.myVote > 0}
                  onClick={() => {
                    if (this.props.taskInfo.myVote !== 1) {
                      fetch(
                        "/api/task/" +
                          this.props.taskInfo.id_task +
                          "/votePlus",
                        { method: "GET" }
                      )
                        .then(res => res.json())
                        .then(data => {
                          if (data.status === "OK") {
                            let newTask = this.props.taskInfo;
                            if (this.props.taskInfo.myVote !== 0)
                              newTask.voteCount += 2;
                            else {
                              newTask.totalVote++;
                              newTask.voteCount += 1;
                            }
                            newTask.myVote = 1;
                            this.props.editTask(newTask);
                          }
                        });
                    }
                  }}
                >
                  +
                </button>
              </div>
              <span>{this.props.taskInfo.totalVote} votes</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return null;
}
function mapDispatchToProps(dispatch) {
  return {
    configEditModal: config => dispatch(configEditModal(config)),
    editTask: taskInfo => dispatch(editTask(taskInfo)),
    removeTask: taskId => dispatch(removeTask(taskId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
