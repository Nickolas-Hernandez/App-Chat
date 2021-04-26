import React from 'react';
import TextAreaInput from './text-area-input';
import Messages from './messages';
import ChatDetailsDrawer from './chat-details-drawer';
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

  componentDidMount() {
    this.socket = io();
    fetch(`/api/rooms/${this.props.roomId}`)
      .then(response => response.json())
      .then(result => {
        this.setState({
          roomId: result.chatId,
          roomName: result.name,
          members: result.members,
          messages: [],
          sendMessage: ''
        });
      });
    const { socket } = this;
    socket.emit('join_chat', {
      chatRoomId: this.props.roomId
    });
    socket.on('new_message', message => {
      const newState = this.buildNewState();
      newState.messages.push(message);
      this.setState(newState);
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  buildNewState() {
    const messages = { messages: this.state.messages.slice() };
    const members = { members: this.state.members.slice() };
    const newState = Object.assign({}, this.state, messages, members);
    return newState;
  }

  getMessageInput(value) {
    const newState = this.buildNewState();
    newState.sendMessage = value;
    this.setState(newState);
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
    const newState = this.buildNewState();
    newState.sendMessage = '';
    this.setState(newState);
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
              <ChatDetailsDrawer userName={userName} userId={userId} id={roomId} members={members}/>
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
