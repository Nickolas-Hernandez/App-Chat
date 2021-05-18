import React from 'react';

export default class UserProfileDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      userName: null,
      newUserName: ''
    };
    this.showForm = this.showForm.bind(this);
    this.getName = this.getName.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
  }

  componentDidMount() {
    this.setState({ userName: this.props.user.userName });
  }

  showForm(event) {
    if (this.state.formIsOpen) {
      this.setState({ formIsOpen: false });
      return;
    }
    this.setState({ formIsOpen: true });
  }

  getName(event) {
    this.setState({ newUserName: event.target.value });
  }

  async updateUserName(event) {
    event.preventDefault();
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: this.state.newUserName })
    };
    try {
      const response = await fetch(`/api/username/${this.props.user.userId}`, init);
      const resultJSON = await response.json();
      const { token, user } = resultJSON;
      this.updateNameInRooms(this.props.user.userName, user.userName);
      window.localStorage.setItem('chat-app-jwt', token);
      this.setState({ userName: user.userName });
      this.props.updateUser(user);
      this.setState({ newUserName: '', formIsOpen: false });
    } catch (err) {
      console.error(err);
    }
  }

  updateNameInRooms(oldName, newName) {
    const chatRooms = this.props.user.chatRooms;
    chatRooms.forEach(chatRoom => {
      fetch(`/api/getRoomMembers/${chatRoom}`)
        .then(response => response.json())
        .then(result => {
          const { members } = result;
          const updated = members.map(member => {
            if (member === oldName) {
              return newName;
            }
            return member;
          });
          const init = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updatedMembers: updated })
          };
          fetch(`/api/updateRoomMembers/${chatRoom}`, init)
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    });
  }

  render() {
    const drawerIsOpen = this.props.isOpen;
    return (
      <>
        <i onClick={this.props.handleDrawer}
        className="fas fa-cog details-icon"></i>
        <div id="profile" className={drawerIsOpen ? 'overlay details-drawer ' : 'hidden' }></div>
          <div className={drawerIsOpen ? 'chat-details-drawer active' : 'chat-details-drawer'}>
            <div className='drawer-contents'>
              <div className="chat-id-wrapper profile">
                <h3 className="username-label">Username:</h3>
                <p className="username">{this.state.userName}</p>
                <i className="fas fa-edit edit-icon" onClick={this.showForm}></i>
              </div>
              <form
              onSubmit={this.updateUserName}
              className={this.state.formIsOpen ? 'update-username' : 'hidden'}>
                <input type="text" onChange={this.getName} value={this.state.newUserName} className="name-input"/>
                <input type="submit" className="submit-button"/>
              </form>
            </div>
          </div>
      </>
    );
  }
}
