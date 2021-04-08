import React from 'react';
import Home from './pages/home';
import { io } from 'socket.io-client';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io();
    console.log(this.socket);
    this.socket.emit('newRoom', { room: 'room bitch' });
  }

  render() {
    return <Home />;
  }
}
