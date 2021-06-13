import React from 'react';
import TextAreaInput from '../components/text-area-input';
import Messages from '../components/messages';
import ChatDetailsDrawer from '../components/chat-details-drawer';

export default class MessageArea extends React.Component {
  constructor(props) {
    super(props);
    this.getMessageInput = this.getMessageInput.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  getMessageInput(value) {
    this.setState({ sendMessage: value });
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
    this.setState({ sendMessage: '' });
  }

  render() {
    const { userName, userId } = this.props.user;
    const { roomId, roomMembers, roomName } = this.props;
    return (
        <div className={roomId ? 'message-area active' : 'message-area'}>
          <div className="message-area-header">
            <div className="wrapper">
              <a href="#">
                <i onClick={this.props.exitRoom} className="fas fa-angle-left back-arrow"></i>
              </a>
              <h1>{roomId ? roomName : 'No room selected'}</h1>
              <ChatDetailsDrawer
              updateUser={this.props.userUpdate}
              userName={userName}
              userId={userId}
              id={roomId || null }
              members={roomId ? roomMembers : null}/>
            </div>
          </div>
          {roomId ? <Messages user={userName} messages={this.props.roomMessages} /> : ''}
          <TextAreaInput
            onSend={this.sendMessage}
            messageValue={this.props.sendMessage}
            onInputChange={this.getMessageInput}
          />
        </div>
    );
  }
}
