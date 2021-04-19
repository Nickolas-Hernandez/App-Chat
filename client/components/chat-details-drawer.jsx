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
    console.log(drawerIsOpen);
    return (
      <>
        <i onClick={this.openDrawer} className="fas fa-sign details-icon"></i>
        <div className={drawerIsOpen ? 'overlay details-drawer ' : 'hidden' }></div>
          <div className={drawerIsOpen ? 'chat-details-drawer active' : 'chat-details-drawer'}>
            <h3>Chat Room ID:</h3>
            <p>{this.props.id}</p>
          </div>
      </>
    );
  }
}
