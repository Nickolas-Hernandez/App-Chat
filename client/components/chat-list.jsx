import React from 'react';
import NewChatForm from './new-chat-form';

export default class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openForm: false };
    this.openNewChatForm = this.openNewChatForm.bind(this);
  }

  openNewChatForm() {
    this.setState({ openForm: true });
  }

  render() {
    return (
      <>
       <NewChatForm isOpen={this.state.openForm} />
        <div className="chat-list-header">
          <div className="wrapper">
            <h1>Chats</h1>
            <i
            onClick={this.openNewChatForm}
            className="fas fa-plus plus-icon"></i>
          </div>
        </div>
        <ul className="chat-list"></ul>
      </>
    );
  }
}