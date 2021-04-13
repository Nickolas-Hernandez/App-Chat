import React from 'react';

export default class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.adjustTextareaHeight = this.adjustTextareaHeight.bind(this);
  }

  adjustTextareaHeight(event) {
    event.target.style.height = '24px';
    event.target.style.height = `${event.target.scrollHeight}px`;

  }

  render() {
    return (
      <div className="message-area">
        <div className="message-area-header">
          <div className="wrapper">
            <i className="fas fa-angle-left back-arrow"></i>
            <h1>ChatRoom</h1>
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
