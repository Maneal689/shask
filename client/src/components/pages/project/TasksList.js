import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import "bootstrap";

import Task from "./Task";
import { configAddModal, editTask } from "../../../redux/actions";

class TasksList extends Component {
  constructor(props) {
    super(props);
    this.activeTab = 1;
    this.getTasksOfState = this.getTasksOfState.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  getTasksOfState(state) {
    let res = [];
    let list = this.props.list.sort((a, b) => b.priority - a.priority);
    for (let task of list.filter(task => task.state === state))
      res.push(<Task taskInfo={task} />);
    return res;
  }

  onDrop(e, newState) {
    e.preventDefault();
    try {
      let taskInfo = JSON.parse(e.dataTransfer.getData("json"));
      if (taskInfo.id_task) {
        taskInfo.state = newState;
        fetch("/api/task/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskInfo),
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === "OK") {
              this.props.editTask(taskInfo);
              $("#" + this.props.id).modal("hide");
            } else console.error(data);
          });
      }
    } catch {}
  }

  render() {
    let nbTaskReducer = state => {
      return (acc, task) => acc + (task.state === state ? 1 : 0);
    };

    const NavTab = ({ text, state, active }) => {
      let className = "nav-item nav-link" + (active ? " active" : "");
      return (
        <a
          className={className}
          data-toggle="tab"
          role="tab"
          href={`#nav-state-${state}`}
          aria-selected="true"
          onClick={() => {
            this.activeTab = state;
            this.props.configAddModal({ state });
          }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => this.onDrop(e, state)}
        >
          {text}
          <span className="badge badge-primary ml-2">
            {this.props.list.reduce(nbTaskReducer(state), 0)}
          </span>
        </a>
      );
    };

    const Pane = ({ state, active }) => {
      let className = "tab-pane fade" + (active ? " active show" : "");
      return (
        <div className={className} id={`nav-state-${state}`} role="tabpanel">
          <div className="row">{this.getTasksOfState(state)}</div>
        </div>
      );
    };

    return (
      <div id="tasks-list" className="col-12">
        <nav>
          <div className="nav nav-tabs" role="tablist">
            <NavTab text="Idée" state={1} active={this.activeTab === 1} />
            <NavTab text="A faire" state={2} active={this.activeTab === 2} />
            <NavTab text="En cours" state={3} active={this.activeTab === 3} />
            <NavTab text="Fini" state={4} active={this.activeTab === 4} />
          </div>
        </nav>
        <div className="tab-content">
          <Pane state={1} active={this.activeTab === 1} />
          <Pane state={2} active={this.activeTab === 2} />
          <Pane state={3} active={this.activeTab === 3} />
          <Pane state={4} active={this.activeTab === 4} />
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
    configAddModal: config => dispatch(configAddModal(config)),
    editTask: taskInfo => dispatch(editTask(taskInfo)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksList);
