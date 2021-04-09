import React from 'react';
import NewChatForm from './new-chat-form';

export default class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      form: {
        chatName: '',
        userName: ''
      }
    };
    this.openNewChatForm = this.openNewChatForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeForm = this.closeForm.bind(this);
    // this.closeNewChatForm = this.closeNewChatForm.bind(this);
  }

  openNewChatForm() {
    this.setState({
      formIsOpen: true,
      form: {
        chatName: '',
        userName: ''
      }
    });
  }

  handleChange(target) {
    const newState = Object.assign({}, this.state);
    if (target.id === 'chat-name') {
      newState.form.chatName = target.value;
      this.setState(newState);
      return;
    }
    newState.form.userName = target.value;
    this.setState(newState);
  }

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    const newState = Object.assign({}, this.state);
    newState.formIsOpen = false;
    this.setState(newState);
  }

  render() {
    const { formIsOpen, form: formInput } = this.state;
    const form = formIsOpen
      ? <NewChatForm
          isOpen={formIsOpen}
          chatName={formInput.chatName}
          userName={formInput.userName}
          onInputChange={this.handleChange}
          handleFormClose={this.closeForm}
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
