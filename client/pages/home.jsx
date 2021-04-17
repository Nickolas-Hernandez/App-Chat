import React from 'react';
import ChatListSection from '../components/chat-list-section';
import MessageArea from '../components/message-area';
import CreateUserForm from '../components/create-user-form';
import parseRoute from '../lib/parse-route';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: {}
    };
    this.submitUser = this.submitUser.bind(this);
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
  }

  submitUser(user) {
    console.log(user);
  }

  render() {
    return <CreateUserForm createUser={this.submitUser} />;
    // const { route } = this.state;
    // if (route.path === '') {
    //   return <ChatListSection />;
    // }
    // if (route.path === 'rooms') {
    //   const roomId = route.params.get('roomId');
    //   return <MessageArea roomId={roomId} />;
    // }
  }
}
