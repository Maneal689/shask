import React, { Component } from "react";
import $ from "jquery";

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
    let bgToToggle = undefined;
    let textToToggle = undefined;
    let btnToToggle = undefined;
    if (checked) {
      bgToToggle = $(".bg-light");
      textToToggle = $(".text-dark");
      btnToToggle = $(".btn-light");
    } else {
      bgToToggle = $(".bg-dark");
      textToToggle = $(".text-light");
      btnToToggle = $(".btn-dark");
    }
    bgToToggle.toggleClass("bg-light");
    bgToToggle.toggleClass("bg-dark");
    textToToggle.toggleClass("text-light");
    textToToggle.toggleClass("text-dark");
    btnToToggle.toggleClass("btn-light");
    btnToToggle.toggleClass("btn-dark");
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

export default NavigationBar;
