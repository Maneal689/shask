import React, { Component } from "react";
import { connect } from "react-redux";

import CollaboratorList from "./CollaboratorList";
import ProjectsList from "./ProjectsList";
import NavigationBar from "../NavigationBar";

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createProject = this.createProject.bind(this);
  }

  componentDidMount() {
    fetch("/api/user/me", { method: "GET" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") this.setState(data.infos);
        else document.location.href = "/";
      });
  }

  createProject(title) {
    fetch("/api/project/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK")
          document.location.href = "/project/" + data.id_project;
      });
  }

  render() {
    let myProjectsIdList = undefined;
    let otherProjectsIdList = undefined;
    if (this.state.projectsIdList) {
      myProjectsIdList = this.state.projectsIdList
        .filter(elm => elm.creator === 1)
        .map(elm => elm.id_project);
      otherProjectsIdList = this.state.projectsIdList
        .filter(elm => elm.creator === 0)
        .map(elm => elm.id_project);
    }
    return (
      <div className="min-vh-100 pt-5">
        <NavigationBar />
        <button
          type="button"
          className="btn btn-large btn-outline-primary rounded-circle"
          style={{
            position: "fixed",
            right: "50px",
            bottom: "50px",
            zIndex: 1000,
          }}
          onClick={() => {
            let projectTitle = window.prompt("Titre du projet:");
            if (projectTitle && projectTitle.length > 0)
              this.createProject(projectTitle);
          }}
        >
          +
        </button>
        {(this.state.projectsIdList && (
          <div>
            <nav>
              <div className="nav nav-tabs" role="tablist">
                <a
                  className={(() =>
                    "nav-item nav-link active d-block w-50 text-center font-weight-bold" +
                    (this.props.nightMode
                      ? " bg-dark text-light"
                      : "bg-list text-dark"))()}
                  data-toggle="tab"
                  href="#nav-my-projects"
                  role="tab"
                  aria-selected="true"
                >
                  Mes projets
                  <span className="badge badge-secondary ml-2">
                    {myProjectsIdList.length}
                  </span>
                </a>
                <a
                  className={(() =>
                    "nav-item nav-link d-block w-50 text-center font-weight-bold" +
                    (this.props.nightMode
                      ? " bg-dark text-light"
                      : "bg-list text-dark"))()}
                  data-toggle="tab"
                  href="#nav-other-projects"
                  role="tab"
                  aria-selected="false"
                >
                  En collaboration
                  <span className="badge badge-secondary ml-2">
                    {otherProjectsIdList.length}
                  </span>
                </a>
              </div>
            </nav>

            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="nav-my-projects"
                role="tabpanel"
              >
                <ProjectsList projectsIdList={myProjectsIdList} />
              </div>
              <div
                className="tab-pane fade"
                id="nav-other-projects"
                role="tabpanel"
              >
                <ProjectsList projectsIdList={otherProjectsIdList} />
              </div>
            </div>
          </div>
        )) || (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nightMode: state.nightMode,
  };
}
function mapDispatchToProps(dispatch) {
  return null;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
