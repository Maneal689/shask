import React, { Component } from "react";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifiers: {
        username: "",
        password: "",
      },
    };
    this.usernameAlert = undefined;
    this.passwordAlert = undefined;
    this.handleChange = this.props.handleChange.bind(this);
    this.handleFetchErrors = this.handleFetchErrors.bind(this);
  }

  handleFetchErrors() {
    this.usernameAlert = undefined;
    this.passwordAlert = undefined;
    if (this.props.lastFetch) {
      if (this.props.lastFetch.status === "LOGIN_ERROR") {
        let lastFetch = this.props.lastFetch;
        if (lastFetch.item === "username")
          this.usernameAlert = "Identifiant inconnu";
        else if (lastFetch.item === "password")
          this.passwordAlert = "Mot de passe invalide";
      }
    }
  }

  render() {
    this.handleFetchErrors();
    let formClass = alert => {
      let res = "form-control form-group form-control-lg mb-0";
      if (alert) {
        if (alert !== "OK") res += " is-invalid";
        else res += " is-valid";
      }
      return res;
    };
    return (
      <div className="col align-items-center">
        {this.props.lastFetch && this.props.lastFetch.status === "OK" && (
          <div className="alert alert-success" role="alert">
            Inscription réussie
          </div>
        )}
        <form
          onSubmit={e => this.props.login(e, this.state.identifiers)}
          className="col"
        >
          <div className="form-group">
            <input
              type="text"
              placeholder="Nom d'utilisateur / Email"
              name="username"
              onChange={this.handleChange}
              value={this.state.identifiers.username}
              className={formClass(this.usernameAlert)}
            />
            <div className="invalid-feedback">{this.usernameAlert}</div>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Mot de passe"
              name="password"
              onChange={this.handleChange}
              value={this.state.identifiers.password}
              className={formClass(this.passwordAlert)}
            />
            <div className="invalid-feedback">{this.passwordAlert}</div>
          </div>
          <div className="row justify-content-center">
            <input
              type="submit"
              className="btn btn-success btn-lg"
              value="Connexion"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
