import React from 'react';
import NewChatForm from '../components/new-chat-form';
import ChatList from '../components/chat-list';
import UserProfile from '../components/user-profile';
import SocketContext from '../lib/socket-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      profileIsOpen: false,
      form: { chatName: '', chatId: '' },
      chatRooms: []
    };
    this.openNewChatForm = this.openNewChatForm.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.openUserProfile = this.openUserProfile.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch('/api/chatRooms');
      const resultJSON = await response.json();
      const userRooms = resultJSON.filter(room => this.props.user.chatRooms.includes(room.id));
      this.setState({ chatRooms: userRooms });
    } catch (err) {
      console.error(err);
    }
  }

  openNewChatForm() {
    if (this.state.profileIsOpen) return;
    this.setState({ formIsOpen: true });
  }

  closeForm(event) {
    if (event.target.className !== 'overlay') return;
    this.setState({ formIsOpen: false });
  }

  handleFormChange(target) {
    const formInput = Object.assign({}, this.state.form);
    if (target.id === 'chat-name') {
      formInput.chatName = target.value;
    } else formInput.chatId = target.value;
    this.setState({ form: formInput });
  }

  submitForm() {
    const formValues = Object.assign({}, this.state.form);
    formValues.chatName = '';
    formValues.chatId = '';
    if (this.state.form.chatId !== '') {
      this.joinRoom();
    } else this.createRoom();
    this.setState({ formIsOpen: false, form: formValues });
  }

  async createRoom() {
    try {
      const init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatName: this.state.form.chatName,
          members: [this.props.user.userName]
        })
      };
      const response = await fetch('/api/newRoom', init);
      const resultJSON = await response.json();
      this.appendNewChatRoom(resultJSON);
    } catch (err) {
      console.error(err);
    }
  }

  async joinRoom() {
    try {
      this.addRoomMember();
      const response = await fetch(`/api/joinRoom/${this.state.form.chatId}`);
      const resultJSON = await response.json();
      this.appendNewChatRoom(resultJSON);
    } catch (err) {
      console.error(err);
    }
  }

  async addRoomMember() {
    try {
      const id = this.state.form.chatId;
      const response = await fetch(`/api/newRoomMember/${id}`);
      const resultJSON = await response.json();
      const updatedMembers = resultJSON.members;
      updatedMembers.push(this.props.user.userName);
      const init = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: updatedMembers })
      };
      fetch(`/api/newRoomMember/${id}`, init);
    } catch (err) {
      console.error(err);
    }
  }

  appendNewChatRoom(chatRoomDetails) {
    const chatRoom = {
      id: chatRoomDetails.chatId,
      name: chatRoomDetails.name
    };
    const updatedRooms = this.state.chatRooms.slice();
    updatedRooms.unshift(chatRoom);
    const updatedUser = Object.assign({}, this.props.user);
    updatedUser.chatRooms = this.props.user.chatRooms.slice();
    updatedUser.chatRooms.push(chatRoomDetails.chatId);
    this.props.onRoomCreation(updatedUser);
    this.setState({ chatRooms: updatedRooms });
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
    const chatList = (this.props.user.chatRooms.length === 0
      ? <p className="empty-list-message">You don&apos;t belong to any chatrooms yet.</p>
      : <ChatList rooms={this.state.chatRooms} />);
    return (
      <div className="chat-rooms">
        <NewChatForm
          isOpen={formIsOpen}
          chatName={formInput.chatName}
          newChatId={formInput.chatId}
          onInputChange={this.handleFormChange}
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
              updateUser={this.props.userUpdate}
              user={this.props.user}
              userName={this.props.user.userName}
              handleDrawer={this.openUserProfile}
              isOpen={profileIsOpen}/>
          </div>
        </div>
        { chatList }
      </div>
    );
  }
}

Home.contextType = SocketContext;
