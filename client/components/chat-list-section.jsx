import React from 'react';
import NewChatForm from './new-chat-form';
import ChatList from './chat-list';

export default class ChatListSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      form: {
        chatName: ''
      },
      user: this.props.user
    };
    this.openNewChatForm = this.openNewChatForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.buildNewState = this.buildNewState.bind(this);
  }

  componentDidMount() {
    console.log('2', this.state.user);
    this.getAllChatRooms();
  }

  buildNewState() {
    // console.log('rooms:', rooms, typeof rooms);
    const user = { user: Object.assign({}, this.state.user) };
    const formInfo = { form: { chatName: '' } };
    const openForm = { formIsOpen: false };
    const newState = Object.assign({}, this.state, openForm, formInfo, user);
    return newState;
  }

  openNewChatForm() {
    const newState = this.buildNewState();
    newState.formIsOpen = true;
    this.setState(newState);
  }

  handleChange(target) {
    const newState = this.buildNewState();
    newState.form = Object.assign({}, this.state.form);
    newState.formIsOpen = true;
    if (target.id === 'chat-name') {
      newState.form.chatName = target.value;
      this.setState(newState);

    }
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
        this.appendNewChatRoom(result);
      })
      .catch(err => console.error(err));
  }

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    const newState = this.buildNewState();
    this.setState(newState);
  }

  getAllChatRooms() {
    fetch('/api/chatRooms')
      .then(response => response.json())
      .then(result => {
        const newState = this.buildNewState();
        newState.user.chatRooms = result;
        this.setState(newState);
      })
      .catch(err => console.error(err));
  }

  appendNewChatRoom(chatRoomDetails) {
    const chatRoom = {
      id: chatRoomDetails.chatId,
      name: chatRoomDetails.name
    };
    const newState = this.buildNewState();
    newState.user.chatRooms.unshift(chatRoom);
    this.setState(newState);
  }

  render() {
    const { formIsOpen, form: formInput } = this.state;
    return (
      <>
       <NewChatForm
          isOpen={formIsOpen}
          chatName={formInput.chatName}
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
        <ChatList rooms={this.state.user.chatRooms} />
      </>
    );
  }
}
