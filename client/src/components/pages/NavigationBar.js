import React, { Component } from 'react';

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
    }

    logout() {
        fetch('/api/user/logout', { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') document.location.href = '/';
            });
    }

    render() {
        return (
            <div
                className="fixed-top d-flex justify-content-between align-items-center p-2"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            >
                <button
                    style={{ cursor: 'pointer' }}
                    onClick={() => (document.location.href = '/dashboard')}
                    className='btn btn-sm btn-info'
                >
                    Dashboard
                </button>
                <button onClick={this.logout} className="btn btn-light btn-sm">
                    Déconnexion
                </button>
            </div>
        );
    }
}

export default NavigationBar;
