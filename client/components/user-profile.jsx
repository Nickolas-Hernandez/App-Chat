import React from 'react';

export default class UserProfileDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsOpen: false,
      newUserName: ''
    };
    this.showForm = this.showForm.bind(this);
    this.getName = this.getName.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
  }

  showForm(event) {
    if (this.state.formIsOpen) {
      this.setState({ formIsOpen: false });
      return;
    }
    this.setState({ formIsOpen: true });
  }

  getName(event) {
    this.setState({ newUserName: event.target.value });
  }

  updateUserName(event) {
    event.preventDefault();
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: this.state.newUserName })
    };
    fetch(`/api/username/${this.props.user}`, init)
      .then(response => response.json())
      .then(result => {
        const { token } = result;
        window.localStorage.setItem('chat-app-jwt', token);
        location.reload();
      });
    this.setState({ newUserName: '' });
  }

  render() {
    const drawerIsOpen = this.props.isOpen;
    return (
      <>
        <i onClick={this.props.handleDrawer}
        className="fas fa-cog details-icon"></i>
        <div id="profile" className={drawerIsOpen ? 'overlay details-drawer ' : 'hidden' }></div>
          <div className={drawerIsOpen ? 'chat-details-drawer active' : 'chat-details-drawer'}>
            <div className='drawer-contents'>
              <div className="chat-id-wrapper profile">
                <h3 className="username-label">Username:</h3>
                <p className="username">{this.props.userName}</p>
                <i className="fas fa-edit edit-icon" onClick={this.showForm}></i>
              </div>
              <form
              onSubmit={this.updateUserName}
              className={this.state.formIsOpen ? 'update-username' : 'hidden'}>
                <input type="text" onChange={this.getName} value={this.state.newUserName} className="name-input"/>
                <input type="submit" className="submit-button"/>
              </form>
            </div>
          </div>
      </>
    );
  }
}
