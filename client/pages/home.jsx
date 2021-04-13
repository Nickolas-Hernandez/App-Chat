import React from 'react';
import ChatListSection from '../components/chat-list-section';
import MessageArea from '../components/message-area';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <ChatListSection />
        <MessageArea />
      </>
    );
  }
}
