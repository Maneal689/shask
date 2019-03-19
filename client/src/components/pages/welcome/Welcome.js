import React, { Component } from 'react';
import $ from 'jquery';

import bgImg from '../../../images/devImg.jpg';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: 'login',
            lastFetch: undefined,
        };
        this.submitConnection = this.submitConnection.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
    }

    componentDidMount() {
        fetch('/api/user/logged', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') document.location.href = '/dashboard';
            });
    }

    submitConnection(e, identifiers) {
        e.preventDefault();
        fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(identifiers),
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {
                    document.location.href = '/dashboard';
                } else if (data.status === 'LOGIN_ERROR')
                    this.setState({ lastFetch: data });
            });
    }

    submitRegister(e, identifiers) {
        e.preventDefault();
        let emailRegex = /^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9\-\.]{2,10}?\.[a-zA-Z]{2,6}$/;
        let usernameRegex = /^[a-zA-Z0-9\-\._]{3,}$/;
        let passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9@#$%^&+=*.\-_]){6,}$/;
        let errReport = [];

        if (!identifiers.email || identifiers.email.length === 0)
            errReport.push({ desc: 'Missing', item: 'email' });
        else if (!emailRegex.test(identifiers.email))
            errReport.push({ item: 'email', desc: 'Invalid' });

        if (!identifiers.username || identifiers.username.length === 0)
            errReport.push({ desc: 'Missing', item: 'username' });
        else if (!usernameRegex.test(identifiers.username))
            errReport.push({ item: 'username', desc: 'Invalid' });

        if (!identifiers.password || identifiers.password.length === 0)
            errReport.push({ desc: 'Missing', item: 'password' });
        else if (!passwordRegex.test(identifiers.password))
            errReport.push({ item: 'password', desc: 'Invalid' });

        if (errReport.length > 0)
            this.setState({
                lastFetch: {
                    status: 'REGISTER_ERROR',
                    errList: errReport,
                },
            });
        else {
            fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(identifiers),
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ lastFetch: data });
                    if (data.status === 'OK') this.toggleForm();
                });
        }
    }

    handleChange(e) {
        const target = e.target;
        const value = target.value;
        let nState = this.state.identifiers;
        nState[target.name] = value;
        this.setState({ identifiers: nState });
    }

    toggleForm() {
        $('#form-container').animate({ height: 'toggle' }, () => {
            this.setState({
                form: this.state.form === 'login' ? 'register' : 'login',
                lastFetch:
                    this.state.lastFetch && this.state.lastFetch.status === 'OK'
                        ? { status: 'OK' }
                        : undefined,
            });
            $('#form-container').animate({
                height: 'toggle',
            });
        });
    }

    render() {
        return (
            <div
                style={{
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundImage: 'url(' + bgImg + ')',
                }}
                className="row align-items-center justify-content-center vh-100"
            >
                <div
                    className="col-lg-4 col-md-7 col-sm-12"
                    style={{
                        padding: '15px',
                        borderRadius: '25px',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    }}
                >
                    <div id="form-container" style={{ overflow: 'hidden' }}>
                        {this.state.form === 'login' ? (
                            <LoginForm
                                lastFetch={this.state.lastFetch}
                                handleChange={this.handleChange}
                                login={this.submitConnection}
                            />
                        ) : (
                            <RegisterForm
                                lastFetch={this.state.lastFetch}
                                handleChange={this.handleChange}
                                register={this.submitRegister}
                            />
                        )}
                    </div>
                    <span className="align-self-center">
                        {this.state.form === 'login'
                            ? 'Pas encore de compte? '
                            : 'Déjà inscrit? '}
                        <a href="#" onClick={this.toggleForm}>
                            {this.state.form === 'login'
                                ? 'Incrivez-vous'
                                : 'Connectez-vous'}
                        </a>
                    </span>
                </div>
            </div>
        );
    }
}

export default Welcome;
