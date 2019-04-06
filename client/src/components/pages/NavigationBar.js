import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";

import { toggleNightMode } from "../../redux/actions";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.logout = this.logout.bind(this);
    this.toggleNightMode = this.toggleNightMode.bind(this);
  }

  logout() {
    fetch("/api/user/logout", { method: "GET" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") document.location.href = "/";
      });
  }

  toggleNightMode(e) {
    let checked = e.target.checked;
    this.props.toggleNightMode(checked);
  }

  render() {
    let Switch = ({ labelText, f }) => {
      let id = "id" + labelText;
      return (
        <div class="custom-control custom-switch d-flex ml-3 mr-3">
          <input
            type="checkbox"
            class="custom-control-input"
            id={id}
            checked={this.props.nightMode}
            onChange={f}
          />
          <label class="custom-control-label text-dark" htmlFor={id}>
            {labelText}
          </label>
        </div>
      );
    };
    return (
      <div className="fixed-top d-flex justify-content-between align-items-center bg-secondary p-2">
        <button
          style={{ cursor: "pointer" }}
          onClick={() => (document.location.href = "/dashboard")}
          className="btn btn-sm btn-info"
        >
          Dashboard
        </button>
        <div className="d-flex">
          <Switch labelText="Mode nuit" f={this.toggleNightMode} />
          <button onClick={this.logout} className="btn btn-light btn-sm">
            Déconnexion
          </button>
        </div>
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
  return {
    toggleNightMode: val => dispatch(toggleNightMode(val)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBar);
