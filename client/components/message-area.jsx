import React from 'react';

export default class MessageArea extends React.Component {

  render() {
    return (
      <div className="message-area-header">
        <div className="wrapper">
          <i className="fas fa-angle-left back-arrow"></i>
          <h1>ChatRoom</h1>
          <i className="fas fa-sign details-icon"></i>
        </div>
      </div>
    );
  }
}
