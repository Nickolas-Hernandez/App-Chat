import React from 'react';
import TextAreaInput from '../components/text-area-input';
import Messages from '../components/messages';
import ChatDetailsDrawer from '../components/chat-details-drawer';
import { io } from 'socket.io-client';

export default class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      roomName: '',
      members: [],
      messages: [],
      sendMessage: ''
    };
    this.getMessageInput = this.getMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  async componentDidMount() {
    this.socket = io();
    const { socket } = this;
    socket.emit('join_chat', {
      chatRoomId: this.props.roomId
    });
    socket.on('new_message', message => {
      const updateMessages = this.state.messages.slice();
      updateMessages.push(message);
      this.setState({ messages: updateMessages });
    });
    try {
      const response = await fetch(`/api/rooms/${this.props.roomId}`);
      const resultJSON = await response.json();
      this.setState({
        roomId: resultJSON.chatId,
        roomName: resultJSON.name,
        members: resultJSON.members,
        messages: [],
        sendMessage: ''
      });
    } catch (err) {
      console.error(err);
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  getMessageInput(value) {
    this.setState({ sendMessage: value });
  }

  sendMessage() {
    const { sendMessage } = this.state;
    if (sendMessage === '') return;
    const message = {
      message: sendMessage,
      sender: this.props.user.userName
    };
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    };
    fetch(`/api/chat/${this.state.roomId}`, init);
    this.resetMessageBox();
  }

  resetMessageBox() {
    this.setState({ sendMessage: '' });
  }

  render() {
    const { userName, userId } = this.props.user;
    const { roomId, members } = this.state;
    return (
        <div className="message-area">
          <div className="message-area-header">
            <div className="wrapper">
              <a href="#">
                <i className="fas fa-angle-left back-arrow"></i>
              </a>
              <h1>{this.state.roomName}</h1>
              <ChatDetailsDrawer
              updateUser={this.props.userUpdate}
              userName={userName}
              userId={userId}
              id={roomId}
              members={members}/>
            </div>
          </div>
          <Messages user={userName} messages={this.state.messages} />
          <TextAreaInput
            onSend={this.sendMessage}
            messageValue={this.state.sendMessage}
            onInputChange={this.getMessageInput}
          />
        </div>
    );
  }
}
