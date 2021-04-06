import React from 'react';

export default class NewChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: '',
      userName: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {

  }

  handleSubmit(event) {

  }

  render() {
    return (
      <>
        <div className="overlay">
          <form onSubmit={this.handleSubmit} className="new-chat-form">
            <h3 className="form-tab active">Create</h3>
            <label htmlFor="chat-name">Enter chat name:</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="chat-name"
              id="chat-name"
            />
            <label htmlFor="users-name">Enter your name:</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="users-name"
              id="users-name"
            />
            <input
              type="submit" value="Submit"
              className="submit-button"
            />
          </form>
        </div>
      </>
    );
  }
}
