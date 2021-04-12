import React from 'react';

export default class MessageArea extends React.Component {

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
        <div className="messages-view">
          <div className="message-input-container">
            <input type="text" name="message-input" id="message-input"/>
            <i className="fas fa-chevron-circle-right send-message-icon"></i>
          </div>
        </div>
      </div>
    );
  }
}
