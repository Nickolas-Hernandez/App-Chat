import React from 'react';
import NewChatForm from './new-chat-form';

export default class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openForm: false,
      form: {
        chatName: '',
        userName: ''
      }
    };
    this.openNewChatForm = this.openNewChatForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.closeNewChatForm = this.closeNewChatForm.bind(this);
  }

  openNewChatForm() {
    this.setState({
      openForm: true,
      form: {
        chatName: '',
        userName: ''
      }
    });
  }

  handleChange(chatName) {
    this.setState(state => {
      return {
        openForm: state.openForm,
        form: {
          chatName: chatName,
          userName: state.userName
        }
      };
    });
  }

  render() {
    const { openForm, form: formInput } = this.state;
    const form = openForm
      ? <NewChatForm
          isOpen={openForm}
          chatName={formInput.chatName}
          onInputChange={this.handleChange}
        />
      : <div></div>;
    return (
      <>
       {form}
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
