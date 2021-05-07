import React from 'react';
import NewChatForm from './new-chat-form';
import ChatList from './chat-list';
import UserProfile from './user-profile';

export default class ChatListSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      profileIsOpen: false,
      form: {
        chatName: '',
        chatId: ''
      },
      chatRooms: []
    };
    this.openNewChatForm = this.openNewChatForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.buildNewState = this.buildNewState.bind(this);
    this.openUserProfile = this.openUserProfile.bind(this);
  }

  componentDidMount() {
    fetch('/api/chatRooms')
      .then(response => response.json())
      .then(result => {
        const usersRooms = result.filter(room => this.props.user.chatRooms.includes(room.id));
        const newState = this.buildNewState();
        newState.chatRooms = usersRooms;
        this.setState(newState);
      })
      .catch(err => console.error(err));
  }

  buildNewState() {
    const openForm = { formIsOpen: false };
    const formInfo = { form: { chatName: '', chatId: '' } };
    const chatRooms = { chatRooms: this.state.chatRooms.slice() };
    const newState = Object.assign({}, this.state, openForm, formInfo, chatRooms);
    return newState;
  }

  openNewChatForm() {
    if (this.state.profileIsOpen) {
      return;
    }
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
      return;
    }
    if (target.id === 'new-chat-id') {
      newState.form.chatId = target.value;
      this.setState(newState);
    }
  }

  submitForm(event) {
    if (this.state.form.chatId !== '') {
      this.joinRoom();
      return;
    }
    const roomDetails = {
      chatName: this.state.form.chatName,
      members: [this.props.user.userName]
    };
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomDetails)
    };
    fetch('/api/newRoom', init)
      .then(response => response.json())
      .then(result => {
        this.appendNewChatRoom(result);
      })
      .catch(err => console.error(err));
  }

  joinRoom() {
    this.addRoomMember();
    fetch(`/api/joinRoom/${this.state.form.chatId}`)
      .then(response => response.json())
      .then(result => {
        this.appendNewChatRoom(result);
      });
  }

  addRoomMember() {
    const id = this.state.form.chatId;
    fetch(`/api/newRoomMember/${id}`)
      .then(response => response.json())
      .then(result => {
        const updatedMembers = result.members;
        updatedMembers.push(this.props.user.userName);
        const init = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: updatedMembers })
        };
        fetch(`/api/newRoomMember/${id}`, init);
      });
  }

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    const newState = this.buildNewState();
    this.setState(newState);
  }

  appendNewChatRoom(chatRoomDetails) {
    const chatRoom = {
      id: chatRoomDetails.chatId,
      name: chatRoomDetails.name
    };
    const newState = this.buildNewState();
    newState.chatRooms.unshift(chatRoom);
    const updatedUser = Object.assign({}, this.props.user);
    updatedUser.chatRooms = this.props.user.chatRooms.slice();
    updatedUser.chatRooms.push(chatRoomDetails.chatId);
    this.props.onRoomCreation(updatedUser);
    this.setState(newState);
  }

  openUserProfile(event) {
    if (!this.state.profileIsOpen) {
      this.setState({ profileIsOpen: true });
      return;
    }
    this.setState({ profileIsOpen: false });
  }

  render() {
    const { formIsOpen, form: formInput, profileIsOpen } = this.state;
    return (
      <div className="chat-rooms">
       <NewChatForm
          isOpen={formIsOpen}
          chatName={formInput.chatName}
          newChatId={formInput.chatId}
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
            <UserProfile
            user={this.props.user.userId}
            userName={this.props.user.userName}
            handleDrawer={this.openUserProfile}
            isOpen={profileIsOpen}/>
          </div>
        </div>
        {
        this.state.chatRooms.length === 0
          ? <p className="empty-list-message">You don&apos;t belong to any chatrooms yet.</p>
          : <ChatList rooms={this.state.chatRooms} />
      }
      </div>
    );
  }
}
