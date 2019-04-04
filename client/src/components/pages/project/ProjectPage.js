import React, {Component} from 'react';
import {connect} from 'react-redux';

import AddTaskModal from './AddTaskModal';
import EditTaskModal from './EditTaskModal';
import CollaboratorsList from './CollaboratorsList';
import TasksList from './TasksList';
import NavigationBar from '../NavigationBar';
import {configProjectPage} from '../../../redux/actions';

class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      myId: undefined,
      username: undefined,
      creator: undefined,
      projectId: props.match.params.id,
      title: undefined,
      description: undefined
    };
    this.deleteProject = this.deleteProject.bind(this);
    this.quitProject = this.quitProject.bind(this);
    this.editProjectName = this.editProjectName.bind(this);
  }

  componentWillMount() {
    fetch('/api/user/logged', {method: 'GET'}).then(res => res.json()).then(data => {
      if (data.status !== 'OK')
        document.location.href = '/';
      else {
        let res = Object.assign({}, this.state, data.userInfo);
        this.setState(res);
      }
    });
  }

  componentDidMount() {
    fetch('/api/project/' + this.state.projectId + '/allInfos', {method: 'GET'}).then(res => res.json()).then(data => {
      if (data.status === 'OK') {
        this.props.configPage(data.infos);
        this.setState({init: true, title: data.infos.title, description: data.infos.description, creator: data.infos.creator});
      }
    });
  }

  quitProject() {
    fetch('/api/project/' + this.state.projectId + '/quit', {method: 'GET'}).then(res => res.json()).then(data => {
      if (data.status === 'OK')
        document.location.href = '/dashboard';
      }
    );
  }

  deleteProject() {
    fetch('/api/project/' + this.state.projectId + '/delete', {method: 'GET'}).then(res => res.json()).then(data => {
      if (data.status === 'OK')
        document.location.href = '/dashboard';
      }
    );
  }

  editProjectName() {
    let newName = window.prompt('Nouveau nom:', this.state.title);
    if (newName && newName.length) {
      newName = newName.trim();
      fetch('/api/project/' + this.state.projectId + '/rename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({newName})
      }).then(res => res.json()).then(data => {
        if (data.status === 'OK')
          this.setState({title: newName});
        }
      );
    }
  }

  render() {
    if (!this.state.init) {
      return (<div className="col-12 hv-100">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>);
    }

    let nbTasks = this.props.tasksList.length;
    let nbTasksChecked = this.props.tasksList.reduce((acc, task) => acc + (
      task.state === 4
      ? 1
      : 0), 0);
    let percent = (nbTasksChecked / nbTasks) * 100;
    return (<div className="pt-5">
      <NavigationBar/>
      <AddTaskModal id="addTaskModal" projectId={this.state.projectId} username={this.state.username}/>
      <EditTaskModal id="editTaskModal"/>
      <button type="button" className="btn btn-large btn-outline-primary rounded-circle" data-toggle="modal" data-target="#addTaskModal" style={{
          position: 'fixed',
          right: '50px',
          bottom: '50px',
          zIndex: 1000
        }}>
        +
      </button>
      <div className="row justify-content-center align-items-center">
        <h1 className="display-4">{this.state.title}</h1>
        {
          this.state.creator === 1 && <button className="ml-3 btn btn-sm rounded-circle btn-light" onClick={this.editProjectName}>
              <i className="fas fa-cog"/>
            </button>
        }
      </div>
      <div id="progress-div text-center" className="col-12 mb-4">
        <h2>
          Progrès: {nbTasksChecked}/{nbTasks}
        </h2>
        <div class="progress" style={{
            height: '2em'
          }}>
          <div class="progress-bar bg-info" role="progressbar" style={{
              width: percent + '%'
            }} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"/>
        </div>
      </div>
      <CollaboratorsList creator={this.state.creator} myId={this.state.myId} projectId={this.state.projectId}/>
      <TasksList list={this.props.tasksList}/> {
        (this.state.creator === 1 && (<div className="row justify-content-center">
          <button className="btn btn-danger btn-lg p-3" onClick={() => {
              let conf = window.prompt(`Entrez le nom du projet ("${this.state.title}") pour valider la suppression:`);
              if (conf && conf === this.state.title)
                this.deleteProject();
              }}>
            Supprimer le projet
          </button>
        </div>)) || (<div class="row justify-content-center">
          <button className="btn btn-danger btn-lg p-3" onClick={() => {
              let conf = window.prompt(`Entrez le nom du projet ("${this.state.title}") pour valider:`);
              if (conf && conf === this.state.title)
                this.quitProject();
              }}>
            Quitter le projet
          </button>
        </div>)
      }
    </div>);
  }
}

function mapStateToProps(state) {
  return {tasksList: state.tasksList};
}
function mapDispatchToProps(dispatch) {
  return {
    configPage: data => dispatch(configProjectPage(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
