import React from 'react';
import Home from './pages/home';
import MessageArea from './pages/message-area';
import CreateUserForm from './components/create-user-form';
import SocketContext from './lib/socket-context';
import { io } from 'socket.io-client';
import { parseRoute, decodeToken } from './lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null,
      roomId: parseRoute(window.location.hash).params.get('roomId'),
      room: {
        roomName: '',
        members: [],
        messages: []
      }
    };
    this.socket = io();
    this.submitNewUser = this.submitNewUser.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const parsedHash = parseRoute(window.location.hash);
      const roomId = parsedHash.params.get('roomId');
      this.setState(state => {
        return ({
          route: parsedHash,
          roomId: roomId
        });
      });
      if (parsedHash.path === 'rooms') {
        this.getRoomData();
        this.connectToRoom(roomId);
      }
    });
    if (this.state.route.path === 'rooms') {
      this.getRoomData();
      this.connectToRoom(this.state.route.params.get('roomId'));
    }
    const token = window.localStorage.getItem('chat-app-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user: user });
    this.initializeSocket();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  initializeSocket() {
    const { socket } = this;
    socket.on('new_message', message => {
      if (message.chatId === this.state.roomId) {
        const updateMessages = this.state.room.messages.slice();
        updateMessages.push(message);
        this.setState(state => {
          return {
            room: {
              roomName: state.room.roomName,
              members: state.room.roomMembers,
              messages: updateMessages
            }
          };
        });
      }
    });
  }

  connectToRoom(id) {
    const { socket } = this;
    socket.emit('join_chat', {
      chatRoomId: id
    });
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

  async getRoomData() {
    const roomId = this.state.route.params.get('roomId');
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      const resultJSON = await response.json();
      this.setState({
        room: {
          roomId: resultJSON.chatId,
          roomName: resultJSON.name,
          members: resultJSON.members,
          messages: [],
          sendMessage: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { route, user } = this.state;
    const { roomName, members, messages, sendMessage } = this.state.room;
    let roomId = route.params.get('roomId');
    if (roomId === '') {
      roomId = null;
    }
    if (!user) return <CreateUserForm createUser={this.submitNewUser} />;
    return (
      <SocketContext.Provider value={this.socket}>
        <Home
          userUpdate={this.updateUser}
          onRoomCreation={this.addRoom}
          user={this.state.user}
        />
        <MessageArea
          userUpdate={this.updateUser}
          user={this.state.user}
          roomName={roomName}
          roomMembers={members}
          roomMessages={messages}
          sendMessage={sendMessage}
          roomId={roomId}
          exitRoom={this.disconnectSocket}
        />
      </SocketContext.Provider>
    );
  }
}
