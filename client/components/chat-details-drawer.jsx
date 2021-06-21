import React from 'react';
import AppContext from '../lib/app-context';

export default class ChatDetailsDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { drawerIsOpen: false };
    this.openDrawer = this.openDrawer.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
  }

  openDrawer(event) {
    if (!this.state.drawerIsOpen) {
      this.setState({ drawerIsOpen: true });
      return;
    }
    this.setState({ drawerIsOpen: false });
  }

  leaveRoom() {
    const { id } = this.props;
    const { username, userId } = this.context.user;
    this.setState({ drawerIsOpen: false });
    fetch(`/api/getRoomMembers/${id}`)
      .then(response => response.json())
      .then(result => {
        const { members } = result;
        const index = members.indexOf(username);
        members.splice(index, 1);
        const init = {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ updatedMembers: members })
        };
        fetch(`/api/updateRoomMembers/${id}`, init)
          .then(() => {
            fetch(`/api/getUserRooms/${userId}`)
              .then(response => response.json())
              .then(result => {
                const roomId = id;
                const rooms = result.chatRooms;
                const index = rooms.indexOf(roomId);
                rooms.splice(index, 1);
                const init = {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chatRooms: rooms })
                };
                fetch(`/api/users/${userId}`, init)
                  .then(response => response.json())
                  .then(result => {
                    const { token, user } = result;
                    window.localStorage.setItem('chat-app-jwt', token);
                    this.props.updateUser(user);
                    window.location.hash = '';
                  })
                  .catch(err => console.error(err));
              })
              .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  render() {
    const { drawerIsOpen } = this.state;
    const { id, members } = this.props;
    return (
      <>
        <i onClick={this.openDrawer} className="fas fa-sign details-icon"></i>
        <div className={drawerIsOpen ? 'overlay details-drawer ' : 'hidden' }></div>
          <div className={drawerIsOpen ? 'chat-details-drawer active' : 'chat-details-drawer'}>
            <div className='drawer-contents'>
              <div className="chat-id-wrapper">
                <h3 className="id-label">Chat Room ID:</h3>
                <p className="room-id">{id || ''}</p>
              </div>
              <h3 className="members-label">Room Members:</h3>
              {members ? <MembersList members={members}/> : ''}
              <button onClick={this.leaveRoom} className='leave-room'>Leave Room</button>
            </div>
          </div>
      </>
    );
  }
}

ChatDetailsDrawer.contextType = AppContext;

function MembersList(props) {
  const allMembers = props.members.map(member => {
    const index = props.members.indexOf(member);
    return <Member key={index} name={member} />;
  });
  return <ul className="members-list">{allMembers}</ul>;
}

function Member(props) {
  return (
    <li className="member-item">{props.name}</li>
  );
}
