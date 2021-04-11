import React from 'react';
import NewChatForm from './new-chat-form';
import ChatList from './chat-list';

export default class ChatListSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      form: {
        chatName: '',
        userName: ''
      },
      chatRooms: []
    };
    this.openNewChatForm = this.openNewChatForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidMount() {
    this.getAllChatRooms();
  }

  openNewChatForm() {
    const newState = this.resetState();
    newState.formIsOpen = true;
    this.setState(newState);
  }

  handleChange(target) {
    const buildState = this.resetState();
    const form = { form: Object.assign({}, this.state.form) };
    const newState = Object.assign({}, buildState, form);
    newState.formIsOpen = true;
    if (target.id === 'chat-name') {
      newState.form.chatName = target.value;
      this.setState(newState);
      return;
    }
    newState.form.userName = target.value;
    this.setState(newState);
  }

  submitForm() {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.form)
    };
    fetch('/api/newRoom', init)
      .then(response => response.json())
      .then(result => {
        this.getAllChatRooms();
      })
      .catch(err => console.error(err));
  }

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    const newState = this.resetState();
    this.setState(newState);
  }

  resetState() {
    const rooms = { chatRooms: this.state.chatRooms.slice() };
    const formInfo = { form: { chatName: '', userName: '' } };
    const openForm = { formIsOpen: false };
    const newState = Object.assign({}, this.state, openForm, formInfo, rooms);
    return newState;
  }

  getAllChatRooms() {
    fetch('/api/chatRooms')
      .then(response => response.json())
      .then(result => {
        const newState = this.resetState();
        newState.chatRooms = result;
        this.setState(newState);
      })
      .catch(err => console.error(err));
  }

  render() {
    const { formIsOpen, form: formInput } = this.state;
    return (
      <>
       <NewChatForm
          isOpen={formIsOpen}
          chatName={formInput.chatName}
          userName={formInput.userName}
          onInputChange={this.handleChange}
          handleFormClose={this.closeForm}
          onSubmission={this.submitForm}
       />
        <div className="chat-list-header">
          <div className="wrapper">
            <h1>Chats</h1>
            <i
            onClick={this.openNewChatForm}
            className="fas fa-plus plus-icon"></i>
          </div>
        </div>
        <ChatList rooms={this.state.chatRooms.slice()} />
      </>
    );
  }
}
