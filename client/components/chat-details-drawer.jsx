import React from 'react';

export default class ChatDetailsDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { drawerIsOpen: false };
    this.openDrawer = this.openDrawer.bind(this);
  }

  openDrawer(event) {
    if (!this.state.drawerIsOpen) {
      this.setState({ drawerIsOpen: true });
      return;
    }
    this.setState({ drawerIsOpen: false });
  }

  render() {
    const { drawerIsOpen } = this.state;
    return (
      <>
        <i onClick={this.openDrawer} className="fas fa-sign details-icon"></i>
        <div className={drawerIsOpen ? 'overlay details-drawer ' : 'hidden' }></div>
          <div className={drawerIsOpen ? 'chat-details-drawer active' : 'chat-details-drawer'}>
            <h3>Chat Room ID:</h3>
            <p>{this.props.id}</p>
            <h3>Room Members:</h3>
            <MembersList members={this.props.members}/>
          </div>
      </>
    );
  }
}

function MembersList(props) {
  console.log(typeof props.members);
  const allMembers = props.members.map(member => {
    const index = props.members.indexOf(member);
    return <SingleMember key={index} name={member} />;
  });
  return <ul className="members-list">{allMembers}</ul>;
}

function SingleMember(props) {
  return (
    <li className="member-item">{props.name}</li>
  );
}
