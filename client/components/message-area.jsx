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
  }

  componentDidMount() {
    fetch(`/api/rooms/${this.props.roomId}`)
      .then(response => response.json())
      .then(result => {
        this.setState({
          roomId: result.chatId,
          roomName: result.name,
          messages: []
        });
      });
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
        <TextAreaInput />
      </div>
    );
  }
}
