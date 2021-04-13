import React from 'react';
import ChatListSection from '../components/chat-list-section';
import MessageArea from '../components/message-area';
import parseRoute from '../lib/parse-route';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    console.log('hash', window.location.hash);
    window.addEventListener('hashchange', event => {
      const parsedHash = parseRoute(window.location.hash);
      this.setState({ route: parsedHash });
    });
  }

  render() {
    const { route } = this.state;
    if (route.path === '') {
      return <ChatListSection />;
    }
    if (route.path === 'rooms') {
      const roomId = route.params.get('roomId');
      return <MessageArea roomId={roomId} />;
    }
  }
}
