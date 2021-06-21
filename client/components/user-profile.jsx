import React, { Component } from 'react';
import AppContext from '../lib/app-context';

export default class UserProfileDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      username: null,
      newUserName: ''
    };
    this.showForm = this.showForm.bind(this);
    this.getName = this.getName.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
  }

  componentDidMount() {
    const { user } = this.context;
    this.setState({ username: user.username });
  }

  showForm(event) {
    if (this.state.formIsOpen) {
      this.setState({ formIsOpen: false });
      return;
    }
    this.setState({ formIsOpen: true });
  }

  getName(event) {
    this.setState({ newUsername: event.target.value });
  }

  async updateUsername(event) {
    event.preventDefault();
    try {
      const { user } = this.context;
      const init = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.state.newUsername })
      };
      const response = await fetch(`/api/username/${user.userId}`, init);
      const resultJSON = await response.json();
      const { token, user: newUsername } = resultJSON;
      this.updateNameInRooms(user.username, newUsername.userame);
      window.localStorage.setItem('chat-app-jwt', token);
      this.setState({ username: newUsername.username });
      this.props.updateUser(user);
      this.setState({ newUserName: '', formIsOpen: false });
    } catch (err) {
      console.error(err);
    }
  }

  updateNameInRooms(oldName, newName) {
    const { chatRooms } = this.props.user;
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
            <div className='drawer-contents profile-contents'>
              <div className="chat-id-wrapper profile">
                <h3 className="username-label">Username:</h3>
                <p className="username">{this.state.username}</p>
                <i className="fas fa-edit edit-icon" onClick={this.showForm}></i>
              </div>
              <form
              onSubmit={this.updateUserName}
              className={this.state.formIsOpen ? 'update-username' : 'hidden'}>
                <input type="text" onChange={this.getName} value={this.state.newUserName} className="name-input"/>
                <input type="submit" className="submit-button"/>
              </form>
              <a href="#" className="log-out" onClick={this.props.onLogOut}>Log out</a>
            </div>
          </div>
      </>
    );
  }
}

UserProfileDrawer.contextType = AppContext;
