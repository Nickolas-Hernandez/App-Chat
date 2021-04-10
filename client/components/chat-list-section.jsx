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
    fetch('/api/chatRooms')
      .then(response => response.json())
      .then(result => {
        const rooms = { chatRooms: result };
        const formInfo = { form: Object.assign({}, this.state.form) };
        const newState = Object.assign({}, this.state, formInfo, rooms);
        this.setState(newState);
      })
      .catch(err => console.error(err));
  }

  openNewChatForm() {
    const openForm = Object.assign({}, this.state);
    openForm.formIsOpen = true;
    this.setState(openForm);
  }

  handleChange(target) {
    let newState;
    const rooms = { chatRooms: this.state.chatRooms.slice() };
    const form = { form: Object.assign({}, this.state.form) };
    if (target.id === 'chat-name') {
      form.form.chatName = target.value;
      newState = Object.assign({}, this.state, form, rooms);
      this.setState(newState);
      return;
    }
    form.form.userName = target.value;
    newState = Object.assign({}, this.state, form, rooms);
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
        this.resetState(result);
      })
      .catch(err => console.error(err));
  }

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    this.resetState();
  }

  resetState(newRoom) {
    const rooms = { chatRooms: this.state.chatRooms.slice() };
    if (newRoom) rooms.chatRooms.unshift(newRoom);
    const formInfo = { form: { chatName: '', userName: '' } };
    const openForm = { formIsOpen: false };
    const newState = Object.assign({}, this.state, openForm, formInfo, rooms);
    this.setState(newState);
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
