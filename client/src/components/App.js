import React, { Component } from "react";
import DashBoard from "./pages/dashboard/DashBoard";
import Welcome from "./pages/welcome/Welcome";
import ProjectPage from "./pages/project/ProjectPage";
import "../styles/App.css";
import "bootstrap";

import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { Route } from "react-router";
import { connect } from "react-redux";

//Default App sample

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { connected: false };
  }

  render() {
    return (
      <Router>
        <div
          className={(() =>
            "container-fluid min-vh-100" +
            (this.props.nightMode
              ? " bg-dark text-light"
              : " bg-light text-dark"))()}
        >
          <Route exact path="/" component={Welcome} />
          <Route path="/dashboard" component={DashBoard} />
          <Route path="/project/:id" component={ProjectPage} />
        </div>
      </Router>
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
)(App);
