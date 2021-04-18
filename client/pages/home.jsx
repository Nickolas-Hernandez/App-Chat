import React from 'react';
import ChatListSection from '../components/chat-list-section';
import MessageArea from '../components/message-area';
import CreateUserForm from '../components/create-user-form';
import parseRoute from '../lib/parse-route';
import decodeToken from '../lib/decode-token';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: null
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
    const token = window.localStorage.getItem('chat-app-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user: user });
  }

  submitUser(user) {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    };
    fetch('/api/createNewUser', init)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        const { user, token } = result;
        window.localStorage.setItem('chat-app-jwt', token);
        this.setState({ user });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { route, user } = this.state;
    if (!user) return <CreateUserForm createUser={this.submitUser} />;
    if (route.path === '') {
      return <ChatListSection />;
    }
    if (route.path === 'rooms') {
      const roomId = route.params.get('roomId');
      return <MessageArea roomId={roomId} />;
    }
  }
}
