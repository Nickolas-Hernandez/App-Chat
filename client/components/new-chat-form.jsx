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
    if (event.target.id === 'chat-name') {
      this.setState(state => {
        return ({
          chatName: event.target.value,
          userName: this.state.userName
        });
      });
      return;
    }
    this.setState(state => {
      return ({
        chatName: this.state.chatName,
        userName: event.target.value
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const chatRoomSetup = Object.assign({}, this.state);
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatRoomSetup)
    };
    fetch('/api/newRoom', init)
      .then(response => response.json())
      .then(result => {
        this.setState({ chatName: '', userName: '' });
      })
      .catch(err => console.error(err));
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
              type="submit"
              value="Submit"
              className="submit-button"
            />
          </form>
        </div>
      </>
    );
  }
}
