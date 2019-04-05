import React, {Component} from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import 'bootstrap';

import Task from './Task';
import {editTask} from '../../../redux/actions';

class TasksList extends Component {
  constructor(props) {
    super(props);
    this.getTasksOfState = this.getTasksOfState.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  getTasksOfState(state) {
    let res = [];
    let list = this.props.list.sort((a, b) => b.priority - a.priority);
    for (let task of list.filter(task => task.state === state))
      res.push(<Task taskInfo={task}/>);
    return res;
  }

  onDrop(e, newState) {
    e.preventDefault();
    let taskInfo = JSON.parse(e.dataTransfer.getData("json"));
    taskInfo.state = newState;
    fetch('/api/task/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskInfo)
    }).then(res => res.json()).then(data => {
      if (data.status === 'OK') {
        this.props.editTask(taskInfo);
        $('#' + this.props.id).modal('hide');
      } else
        console.error(data);
      }
    );
  }

  render() {
    let nbTaskReducer = state => {
      return(acc, task) => acc + (
        task.state === state
        ? 1
        : 0);
    };

    const tab = (text, state, active) => (<a className={(() => {
        return ("nav-item nav-link" + (
          active
          ? ' active'
          : ''));
      })()} data-toggle="tab" href={`#nav-state-${state}`} role="tab" aria-selected="true" onDragOver={(e) => e.preventDefault()} onDrop={e => this.onDrop(e, state)}>
      {text}
      <span className="badge badge-primary">
        {this.props.list.reduce(nbTaskReducer(state), 0)}
      </span>
    </a>);

    return (<div id="tasks-list" className="col-12">
      <nav>
        <div className="nav nav-tabs" role="tablist">
          {tab('Idée', 1, true)}
          {tab('A faire', 2)}
          {tab('En cours', 3)}
          {tab('Fini', 4)}
        </div>
      </nav>
      <div className="tab-content">
        <div className="tab-pane fade show active" id="nav-state-1" role="tabpanel">
          <div className="row">{this.getTasksOfState(1)}</div>
        </div>
        <div className="tab-pane fade" id="nav-state-2" role="tabpanel">
          <div className="row">{this.getTasksOfState(2)}</div>
        </div>
        <div className="tab-pane fade" id="nav-state-3" role="tabpanel">
          <div className="row">{this.getTasksOfState(3)}</div>
        </div>
        <div className="tab-pane fade" id="nav-state-4" role="tabpanel">
          <div className="row">{this.getTasksOfState(4)}</div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  return null;
}
function mapDispatchToProps(dispatch) {
  return {
    editTask: taskInfo => dispatch(editTask(taskInfo))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
