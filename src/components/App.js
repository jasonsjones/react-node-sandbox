import React from 'react';

import authStore from '../stores/authStore';

import LoginPage from './LoginPage';

const styles = {
    container: {
        margin: "0 auto",
        width: 960
    }
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentUser: authStore.getCurrentUser(),
            token: authStore.getToken()
        };

        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentWillMount() {
        authStore.addChangeListenter(this.updateUser);
    }

    componentWillUnmount() {
        authStore.removeChangeListener(this.updateUser);
    }

    updateUser() {
        this.setState({
            currentUser: authStore.getCurrentUser(),
            token: authStore.getToken()
        });
    }

    isUserAuthenticated() {
        return !!this.state.token;
    }

    render() {
        return (
            <div style={styles.container}>
                <LoginPage isAuthenticated={this.isUserAuthenticated()} />
            </div>
        );
    }
}

export default App;