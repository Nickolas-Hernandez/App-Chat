import React from 'react';

export default class NewChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);

  }

  handleChange(event) {
    this.props.onInputChange(event.target);
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
        this.resetForm();
      })
      .catch(err => console.error(err));
  }

  resetForm() {
    this.setState({ chatName: '', userName: '' });
  }

  close(event) {
    this.props.handleFormClose(event);
  }

  render() {
    const { isOpen } = this.props;
    return (
      <>
        <div
          onClick={this.close}
          className={isOpen ? 'overlay' : 'overlay hidden'}
        >
          <form onSubmit={this.handleSubmit} className="new-chat-form">
            <h3 className="form-tab active">Create</h3>
            <label htmlFor="chat-name">Enter chat name:</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="chat-name"
              id="chat-name"
              value={this.props.chatName}
            />
            <label htmlFor="users-name">Enter your name:</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="users-name"
              id="users-name"
              value={this.props.userName}
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
