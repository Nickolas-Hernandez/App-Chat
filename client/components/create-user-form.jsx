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
        <div
          className='overlay'>
          <form onSubmit={this.submitUser} className="new-user-form">
            <h3 className="welcome-message">Hi! Welcome to Chat-App!</h3>
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
        </div>
      </>
    );
  }
}
