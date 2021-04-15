import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';
import { io } from 'socket.io-client';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = { socket: null };
  }

  componentDidMount() {
    this.socket = io();
    this.setState({ socket: this.socket });
  }

  render() {
    const contextValue = { socket: this.state.socket };
    return (
      <AppContext.Provider value={contextValue}>
        <Home />;
      </AppContext.Provider>
    );
  }
}
