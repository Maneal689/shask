import React, {Component} from 'react';
import {connect} from 'react-redux';

import StarRating from '../StarRating';
import EditTaskModal from './EditTaskModal';
import {configEditModal, removeTask} from '../../../redux/actions';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<div className="col-12 col-sm-6 col-lg-4 col-xl-3 p-3" style={{
        backgroundColor: this.props.taskInfo.color
      }}>
      <div className="border border-info rounded pl-3 pr-3 pt-2 pb-1" style={{
          height: '10em',
          overflowY: 'scroll'
        }}>
        <div className="d-flex justify-content-between">
          <strong>{this.props.taskInfo.title}</strong>
          <div className="btn-group">
            <button
              data-toggle="modal"
              data-target="#editTaskModal"
              className="btn btn-sm btn-light"
              onClick={() => {
                this.props.configEditModal(this.props.taskInfo);
              }}>
              <i className="fas fa-cog" />
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => {
                let res = window.confirm('Supprimer la tâche?');
                if (res) {
                  fetch("/api/task/" + this.props.taskInfo.id_task + "/remove", {method: 'GET'}).then(res => res.json()).then(data => {
                    if (data.status === 'OK')
                      this.props.removeTask(this.props.taskInfo.id_task);
                    }
                  );
                }
              }}>
              &times;
            </button>
          </div>
        </div>
        <hr className="m-2"/>
        <div>
          <p className="mb-0">
            {this.props.taskInfo.description}
          </p>
          <footer className="blockquote-footer">
            {this.props.taskInfo.username}
          </footer>
        </div>
        <hr className="m-1"/>
        <div className="d-flex flex-row justify-content-between">
          <small className="d-flex">
            Priorité:{' '}
            <StarRating title="Priorité" nbStar={5} color="#17A2B8" editable={false} default={this.props.taskInfo.priority}/>
          </small>
          <small className="d-flex">
            Difficulté:{' '}
            <StarRating title="Difficulté" nbStar={5} color="#FF770F" editable={false} default={this.props.taskInfo.difficulty}/>
          </small>
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
    configEditModal: config => dispatch(configEditModal(config)),
    removeTask: taskId => dispatch(removeTask(taskId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);
