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
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  openNewChatForm() {
    const openForm = Object.assign({}, this.state);
    openForm.formIsOpen = true;
    this.setState(openForm);
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

  submitForm() {
    const chatRoomSetup = Object.assign({}, this.state.form);
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

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    this.resetForm();
  }

  resetForm() {
    this.setState({
      formIsOpen: false,
      form: {
        chatName: '',
        userName: ''
      }
    });
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
          onSubmission={this.submitForm}
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
