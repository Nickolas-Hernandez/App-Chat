import React from 'react';
import TextAreaInput from './text-area-input';

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
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: this.state.sendMessage })
    };
    fetch(`/api/chat/${this.state.roomId}`, init)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(err => console.error(err));
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
        <div className="messages-view"></div>
        <TextAreaInput
          onSend={this.sendMessage}
          onInputChange={this.getMessageInput}
        />
      </div>
    );
  }
}
