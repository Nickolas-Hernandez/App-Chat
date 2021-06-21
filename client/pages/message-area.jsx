import React from 'react';
import TextAreaInput from '../components/text-area-input';
import Messages from '../components/messages';
import ChatDetailsDrawer from '../components/chat-details-drawer';

export default class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sendMessage: '' };
    this.getMessageInput = this.getMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  getMessageInput(value) {
    this.setState({ sendMessage: value });
  }

  sendMessage() {
    const { sendMessage } = this.state;
    const { roomId, user } = this.props;
    if (sendMessage === '') return;
    const message = {
      message: sendMessage,
      sender: user.username
    };
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    };
    fetch(`/api/chat/${roomId}`, init);
    this.resetMessageBox();
  }

  resetMessageBox() {
    this.setState({ sendMessage: '' });
  }

  render() {
    const { username, userId } = this.props.user;
    const { roomId, roomMembers, roomName, roomMessages, userUpdate } = this.props;
    return (
        <div className={roomId ? 'message-area active' : 'message-area'}>
          <div className="message-area-header">
            <div className="wrapper">
              <a href="#">
                <i onClick={this.exitRoom} className="fas fa-angle-left back-arrow"></i>
              </a>
              <h1>{roomId ? roomName : 'No room selected'}</h1>
              <ChatDetailsDrawer
              updateUser={userUpdate}
              username={username}
              userId={userId}
              id={roomId || null }
              members={roomId ? roomMembers : null}/>
            </div>
          </div>
          {roomId ? <Messages user={username} messages={roomMessages} /> : <div className="messages-view"></div>}
          <TextAreaInput
            onSend={this.sendMessage}
            messageValue={this.state.sendMessage}
            onInputChange={this.getMessageInput}
          />
        </div>
    );
  }
}
