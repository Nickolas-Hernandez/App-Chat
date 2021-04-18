import React from 'react';
import ChatListSection from '../components/chat-list-section';
import MessageArea from '../components/message-area';
import CreateUserForm from '../components/create-user-form';
import { parseRoute, decodeToken } from '../lib';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null
    };
    this.submitNewUser = this.submitNewUser.bind(this);
    this.addRoom = this.addRoom.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const parsedHash = parseRoute(window.location.hash);
      this.setState(state => {
        return ({
          route: parsedHash,
          user: state.user
        });
      });
    });
    const token = window.localStorage.getItem('chat-app-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user: user });
  }

  submitNewUser(user) {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    };
    fetch('/api/createNewUser', init)
      .then(response => response.json())
      .then(result => {
        const { user: retrievedUser, token } = result;
        window.localStorage.setItem('chat-app-jwt', token);
        this.setState({ user: retrievedUser });
      })
      .catch(err => console.error(err));
  }

  addRoom(user) {
    this.setState(state => {
      return { route: state.route, user: user };
    });
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.user)
    };
    fetch(`/api/users/${this.state.user.userId}`, init)
      .then(response => response.json())
      .then(result => {
        const { user: updatedUser, token } = result;
        window.localStorage.setItem('chat-app-jwt', token);
        this.setState(updatedUser);
      });
  }

  render() {
    const { route, user } = this.state;
    if (!user) return <CreateUserForm createUser={this.submitNewUser} />;
    if (route.path === '') {
      return <ChatListSection onRoomCreation={this.addRoom} user={this.state.user}/>;
    }
    if (route.path === 'rooms') {
      const roomId = route.params.get('roomId');
      return <MessageArea user={this.state.user} roomId={roomId} />;
    }
  }
}
