import React, { Component } from 'react';
import $ from 'jquery';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            identifiers: {
                username: '',
                email: '',
                password: '',
            },
        };
        this.emailAlert = undefined;
        this.usernameAlert = undefined;
        this.passwordAlert = undefined;
        this.handleChange = this.props.handleChange.bind(this);
        this.handleFetchErrors = this.handleFetchErrors.bind(this);
    }

    handleFetchErrors() {
        if (this.props.lastFetch) {
            if (this.props.lastFetch.status === 'REGISTER_ERROR') {
                this.usernameAlert = 'OK';
                this.emailAlert = 'OK';
                this.passwordAlert = 'OK';
                let lastFetchErrList = this.props.lastFetch.errList;
                for (let i = 0; i < lastFetchErrList.length; i++) {
                    let lastFetch = lastFetchErrList[i];
                    if (lastFetch.item === 'username') {
                        if (lastFetch.desc === 'Invalid')
                            this.usernameAlert =
                                "Votre nom d'utilisateur doit contenir au moins 3 caractères";
                        else if (lastFetch.desc === 'Already')
                            this.usernameAlert =
                                "Ce nom d'utilisateur est déjà associé à un compte";
                        else this.usernameAlert = "Nom d'utilisateur requis";
                    } else if (lastFetch.item === 'email') {
                        if (lastFetch.desc === 'Invalid')
                            this.emailAlert = 'Email invalide';
                        else if (lastFetch.desc === 'Already')
                            this.emailAlert =
                                'Cet email est déjà associé à un compte';
                        else this.emailAlert = 'Email requis';
                    } else if (lastFetch.item === 'password')
                        if (lastFetch.desc === 'Invalid')
                            this.passwordAlert = 'Mot de passe invalide';
                        else this.passwordAlert = 'Mot de passe requis';
                }
            }
        }
    }

    render() {
        this.handleFetchErrors();
        let formClass = alert => {
            let res = 'form-control form-group form-control-lg mb-1';
            if (alert) {
                if (alert !== 'OK') res += ' is-invalid';
                else res += ' is-valid';
            }
            return res;
        };
        return (
            <form
                onSubmit={e => this.props.register(e, this.state.identifiers)}
                className="col"
            >
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        name="username"
                        onChange={this.handleChange}
                        value={this.state.identifiers.username}
                        className={formClass(this.usernameAlert)}
                    />
                    <div className="invalid-feedback">{this.usernameAlert}</div>
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={this.handleChange}
                        value={this.state.identifiers.email}
                        className={formClass(this.emailAlert)}
                    />
                    <div className="invalid-feedback">{this.emailAlert}</div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <input
                            id='pwdInput'
                            type="password"
                            placeholder="Mot de passe"
                            name="password"
                            onChange={this.handleChange}
                            value={this.state.identifiers.password}
                            className={formClass(this.passwordAlert)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary mb-1" onClick={(e) => {
                                e.preventDefault();
                                let eye = e.currentTarget.children[0];
                                eye.classList.toggle('fa-eye');
                                eye.classList.toggle('fa-eye-slash');

                                let pwd = document.getElementById('pwdInput');
                                let cType = pwd.type;
                                pwd.type = cType === 'password' ? 'text' : 'password';
                            }}><i className="far fa-eye" /></button>
                        </div>
                    </div>
                    <div className="invalid-feedback">{this.passwordAlert}</div>
                    <small
                        id="passwordHelpText"
                        className="form-text text-muted"
                    >
                        Doit contenir 6 caractères minimum dont 1 minuscule, 1
                        majuscule, 1 chiffre
                    </small>
                </div>
                <div className="row justify-content-center">
                    <input
                        type="submit"
                        className="btn btn-success btn-lg"
                        value="Inscription"
                    />
                </div>
            </form>
        );
    }
}

export default RegisterForm;
