import React from 'react';
import Home from './pages/home';
import MessageArea from './pages/message-area';
import CreateUserForm from './components/create-user-form';
import { parseRoute, decodeToken } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null
    };
    this.submitNewUser = this.submitNewUser.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const parsedHash = parseRoute(window.location.hash);
      this.setState(state => {
        return ({
          route: parsedHash
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

  updateUser(userInfo) {
    this.setState({ user: userInfo });
  }

  render() {
    const { route, user } = this.state;
    let roomId = null;
    if (route.path) roomId = route.params.get('roomId');
    if (!user) return <CreateUserForm createUser={this.submitNewUser} />;
    return (
      <>
        <Home
        userUpdate={this.updateUser}
        onRoomCreation={this.addRoom}
        user={this.state.user}/>
        <MessageArea
        userUpdate={this.updateUser}
        user={this.state.user}
        roomId={roomId} />
      </>
    );
  }
}
