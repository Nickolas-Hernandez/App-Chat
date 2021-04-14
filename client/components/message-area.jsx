import React from 'react';

export default class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: this.props.roomId,
      roomName: '',
      roomMessages: []
    };
    this.adjustTextareaHeight = this.adjustTextareaHeight.bind(this);
  }

  componentDidMount() {
    fetch(`/api/rooms/${this.props.roomId}`)
      .then(response => response.json())
      .then(result => {
        this.setState({
          roomId: result.chatId,
          roomName: result.name,
          message: []
        });
      });
  }

  adjustTextareaHeight(event) {
    event.target.style.height = '24px';
    event.target.style.height = `${event.target.scrollHeight}px`;
    event.target.parentElement.style.height = '36px';
    event.target.parentElement.style.height = `${event.target.scrollHeight + 8}px`;
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
        <div className="message-input-container">
            <textarea
              name="message"
              id="message-input"
              onChange={this.adjustTextareaHeight}
              placeholder="Send a message. . . ">
            </textarea>
            <i className="fas fa-chevron-circle-right send-message-icon"></i>
          </div>
      </div>
    );
  }
}
