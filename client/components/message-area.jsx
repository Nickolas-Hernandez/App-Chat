import React from 'react';
import TextAreaInput from './text-area-input';
import AppContext from '../lib/app-context';
import Messages from './messages';

export default class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: this.props.roomId,
      roomName: '',
      messages: [],
      sendMessage: ''
    };
    this.getMessageInput = this.getMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    fetch(`/api/rooms/${this.props.roomId}`)
      .then(response => response.json())
      .then(result => {
        this.setState({
          roomId: result.chatId,
          roomName: result.name,
          messages: [],
          sendMessage: ''
        });
      });
    const { socket } = this.context;
    socket.emit('join_chat', {
      chatRoomId: this.props.roomId
    });
    socket.on('new_message', message => {
      this.appendMessage(message);
    });
  }

  buildNewState() {
    const messages = { messages: this.state.messages.slice() };
    const newState = Object.assign({}, this.state, messages);
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
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: sendMessage })
    };
    fetch(`/api/chat/${this.state.roomId}`, init)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(err => console.error(err));
    const newState = this.buildNewState();
    newState.sendMessage = '';
    this.setState(newState);
  }

  appendMessage(message) {
    const messageObject = { message: message };
    const newState = this.buildNewState();
    newState.messages.unshift(messageObject);
    this.setState(newState);
  }

  render() {
    return (
      <div className="message-area">
        <div className="message-area-header">
          <div className="wrapper">
            <a href="#">
              <i className="fas fa-angle-left back-arrow"></i>
            </a>
            <h1>{this.state.roomName}</h1>
            <i className="fas fa-sign details-icon"></i>
          </div>
        </div>
        <Messages messages={this.state.messages} />
        <TextAreaInput
          onSend={this.sendMessage}
          messageValue={this.state.sendMessage}
          onInputChange={this.getMessageInput}
        />
      </div>
    );
  }
}

MessageArea.contextType = AppContext;
