import React from 'react';

export default class ChatList extends React.Component {
  render() {
    return (
      <>
        <div className="chat-list-header">
          <div className="wrapper">
            <h1>Chats</h1>
            <i className="fas fa-plus"></i>
          </div>
        </div>
      </>
    );
  }
}
