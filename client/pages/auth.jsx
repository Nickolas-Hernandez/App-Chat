import React, { Component } from 'react';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUp: false,
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitUser = this.submitUser.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
  }

  componentWillUnmount() {
    this.setState({ signUp: false, username: '', password: '' });
  }

  handleChange(event) {
    if (event.target.id === 'user-name') {
      this.setState({ username: event.target.value });
      return;
    }
    this.setState({ password: event.target.value });
  }

  submitUser(event) {
    event.preventDefault();
    const { signUp, username, password } = this.state;
    const userData = { username: username, password: password };
    if (signUp) {
      this.props.createUser(userData);
    } else {
      this.props.verifyUser(userData);
    }
  }

  toggleSignUp(event) {
    this.setState(state => {
      return { signUp: !state.signUp };
    });
  }

  render() {
    const { signUp, username, password } = this.state;
    const { authError } = this.props;
    return (
      <>
        <form
          onSubmit={this.submitUser}
          className="new-user-form">
          <h2 className="welcome-message">Hi! Welcome to </h2>
          <h2 className="app-chat">App Chat</h2>
          <h2>{signUp ? 'Sign up' : 'Log in'}</h2>
          <input
            type="text"
            name="user-name"
            id="user-name"
            className={authError ? 'error' : ''}
            onChange={this.handleChange}
            value={username}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            className={authError && !signUp ? 'error' : ''}
            onChange={this.handleChange}
            value={password}
            placeholder="Password"
            required
          />
          <button className="submit-button">Submit</button>
          <p className={authError ? 'auth-error' : 'auth-error hidden'}>{signUp ? 'Username already exists' : 'Invalid log in'}</p>
          <p onClick={this.toggleSignUp} className="sign-up-link">
            {
              signUp
                ? 'Already have an account? Log in here'
                : 'Don\'t have an account? Sign up here'
            }
          </p>
        </form>
      </>
    );
  }
}
