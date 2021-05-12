import React from 'react';

export default class NewChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { createChat: true };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.swapForms = this.swapForms.bind(this);
  }

  handleChange(event) {
    this.props.onInputChange(event.target);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmission(event);
  }

  closeForm(event) {
    this.props.handleFormClose(event);
  }

  swapForms(event) {
    if (event.target.textContent === 'Create') {
      this.setState({ createChat: true });
      return;
    }
    if (event.target.textContent === 'Join') {
      this.setState({ createChat: false });
    }
  }

  render() {
    const { isOpen } = this.props;
    const { createChat } = this.state;
    const formType = createChat
      ? (
      <input
      onChange={this.handleChange}
      type="text"
      name="chat-name"
      id="chat-name"
      value={this.props.chatName}
      required/>
        )
      : (
      <input
      onChange={this.handleChange}
      type="text"
      name="new-chat-id"
      id="new-chat-id"
      value={this.props.newChatId}
      required/>
        );
    return (
      <>
        <div
        onClick={this.closeForm}
        className={isOpen ? 'overlay' : 'overlay hidden'}>
          <form onSubmit={this.handleSubmit} className="new-chat-form">
            <div onClick={this.swapForms} className="tabs-container">
              <h3 className={createChat ? 'form-tab active' : 'form-tab'}>Create</h3>
              <h3 className={!createChat ? 'form-tab active' : 'form-tab' }>Join</h3>
            </div>
            <label htmlFor="chat-name">
              {createChat ? 'Enter chat name:' : 'Enter chat ID:'}
            </label>
            {formType}
            <input
              type="submit"
              value="Submit"
              className="submit-button"
            />
          </form>
        </div>
      </>
    );
  }
}
