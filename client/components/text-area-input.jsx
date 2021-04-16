import React from 'react';

export default class TextAreaInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaScrollHeight: 24
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  handleChange(event) {
    this.props.onInputChange(event.target.value);
    const inputLength = event.target.value.length;
    if (inputLength === 0) {
      this.setState({ textAreaScrollHeight: 24 });
      return;
    }
    this.setState({
      textAreaScrollHeight: event.target.scrollHeight
    });
  }

  sendMessage(event) {
    event.preventDefault();
    this.props.onSend();
    this.setState({ textAreaScrollHeight: 24 });
  }

  render() {
    const { textAreaScrollHeight } = this.state;
    const containerHeight = textAreaScrollHeight + 8;
    const textAreaContainerStyle = {
      height: `${containerHeight}px`
    };
    const textAreaStyle = {
      height: `${textAreaScrollHeight}px`
    };
    return (
        <form
        onSubmit={this.sendMessage}
        className="message-input-container"
        style={textAreaContainerStyle}>
          <textarea
            name="message"
            id="message-input"
            style={textAreaStyle}
            placeholder="Send a message. . . "
            value={this.props.messageValue}
            onChange={this.handleChange}>
          </textarea>
          <button
          className="fas fa-chevron-circle-right send-message-icon"></button>
        </form>
    );
  }
}
