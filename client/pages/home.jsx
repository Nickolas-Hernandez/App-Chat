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
    console.log(target);
    // if(target === )
  }

  render() {
    return (
      <>
        <ChatListSection viewSwap={this.swapViews} />
        {/* <MessageArea /> */}
      </>
    );
  }
}
