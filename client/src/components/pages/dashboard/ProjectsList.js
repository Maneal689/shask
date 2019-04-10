import React, { Component } from "react";
import { connect } from "react-redux";

class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.projectCard = this.projectCard.bind(this);
  }

  projectCard(data) {
    if (data) {
      let nbTasks = data.tasksList.reduce(
        (acc, task) => acc + (task.state > 1 ? 1 : 0),
        0
      );
      let nbTasksChecked = data.tasksList.reduce(
        (acc, elm) => acc + (elm.state === 4 ? 1 : 0),
        0
      );
      let percent = nbTasks > 0 ? (nbTasksChecked / nbTasks) * 100 : 0;
      return (
        <a
          className={(() =>
            "list-group-item list-group-item-action" +
            (this.props.nightMode
              ? " text-light bg-dark"
              : " text-dark bg-light"))()}
          href={(() => "/project/" + data.id_project)()}
        >
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
              <h4 className="">{data.title}</h4>
              <span className="">
                {nbTasksChecked}/{nbTasks}
              </span>
            </div>
            <div class="progress">
              <div
                class="progress-bar bg-info"
                role="progressbar"
                style={{
                  width: percent + "%",
                }}
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </a>
      );
    }
    return <div />;
  }

  componentDidMount() {
    for (let id of this.props.projectsIdList) {
      fetch("/api/project/" + id + "/allInfos", { method: "GET" })
        .then(res => res.json())
        .then(data => {
          if (data.status === "OK") {
            let projectsList = undefined;
            if (!this.state.projectsList) projectsList = [data.infos];
            else
              projectsList = [...this.state.projectsList, data.infos].sort(
                (a, b) => (a.title < b.title ? -1 : 1)
              );
            this.setState({ projectsList });
          }
        });
    }
  }

  render() {
    let projectsTabList = undefined;
    if (this.state.projectsList)
      projectsTabList = this.state.projectsList.map(project =>
        this.projectCard(project)
      );
    return (
      <div className="mb-3 border-0 text-center">
        <div className="list-group list-group-flush">
          {projectsTabList || (
            <div class="list-group-item">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { nightMode: state.nightMode };
}
function mapDispatchToProps(dispatch) {
  return null;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsList);
