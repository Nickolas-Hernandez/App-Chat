import React from 'react';
import ChatListSection from '../components/chat-list-section';
import MessageArea from '../components/message-area';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'chatList'
    };
    this.swapViews = this.swapViews.bind(this);
  }

  swapViews(target) {
    if (target.closest('.chat-list-item')) {
      const room = target.closest('.chat-list-item');
      this.setState({ view: 'messageArea' });
    }
  }

  getView() {
    if (this.state.view === 'chatList') {
      return <ChatListSection viewSwap={this.swapViews} />;
    }
    if (this.state.view === 'messageArea') {
      return <MessageArea />;
    }
  }

  render() {
    const view = this.getView();
    return <>{view}</>;
  }
}
