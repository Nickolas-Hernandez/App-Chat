import React from 'react';

export default class CreateUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: '' };
    this.handleChange = this.handleChange.bind(this);
    this.submitUser = this.submitUser.bind(this);
  }

  handleChange(event) {
    this.setState({ userName: event.target.value });
  }

  submitUser(event) {
    event.preventDefault();
    this.props.createUser(this.state);
    this.setState({ userName: '' });
  }

  render() {
    return (
      <>
        <form onSubmit={this.submitUser} className="new-user-form">
          <h2 className="welcome-message">Hi! Welcome to </h2>
          <h2 className="app-chat">App Chat</h2>
          <label htmlFor="user-name">Enter your name:</label>
          <input
            type="text"
            name="user-name"
            id="user-name"
            onChange={this.handleChange}
            value={this.state.userName}
            required/>
          <button className="submit-button">Submit</button>
        </form>
      </>
    );
  }
}
