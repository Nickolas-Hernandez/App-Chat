import React from 'react';

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
    const id = this.props.userId;
    fetch(`/api/getUserRooms/${id}`)
      .then(response => response.json())
      .then(result => {
        const rooms = result.chatRooms;
        const index = rooms.indexOf(id);
        rooms.splice(index, 1);
        const init = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatRooms: rooms })
        };
        fetch(`/api/users/${id}`, init)
          .then(response => response.json())
          .then(result => {
            const { token } = result;
            window.localStorage.setItem('chat-app-jwt', token);
            // location.reload();
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
    // Remove user from ChatRoom Members
    fetch(`/api/getRoomMembers/${this.props.id}`)
      .then(response => response.json())
      .then(result => {
        const { members } = result;
        const index = members.indexOf(this.props.user.userName);
        members.splice(index, 1);
        const init = {
          method: 'PUT',
          header: { 'Content-type': 'application/json' },
          body: JSON.stringify({ members: members })
        };
        fetch(`/api/updateRoomMembers/${this.props.id}`, init);
      });

  }

  render() {
    const { drawerIsOpen } = this.state;
    return (
      <>
        <i onClick={this.openDrawer} className="fas fa-sign details-icon"></i>
        <div className={drawerIsOpen ? 'overlay details-drawer ' : 'hidden' }></div>
          <div className={drawerIsOpen ? 'chat-details-drawer active' : 'chat-details-drawer'}>
            <div className='drawer-contents'>
              <h3>Chat Room ID:</h3>
              <p>{this.props.id}</p>
              <h3>Room Members:</h3>
              <MembersList members={this.props.members}/>
              <a href="#">
                <button onClick={this.leaveRoom} className='leave-room'>Leave Room</button>
              </a>
            </div>
          </div>
      </>
    );
  }
}

function MembersList(props) {
  const allMembers = props.members.map(member => {
    const index = props.members.indexOf(member);
    return <SingleMember key={index} name={member} />;
  });
  return <ul className="members-list">{allMembers}</ul>;
}

function SingleMember(props) {
  return (
    <li className="member-item">{props.name}</li>
  );
}
