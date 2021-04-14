import React from 'react';

export default class TextAreaInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaScrollHeight: 24
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const inputLength = event.target.value.length;
    if (inputLength === 0) {
      this.setState({ textAreaScrollHeight: 24 });
      return;
    }
    this.setState({
      textAreaScrollHeight: event.target.scrollHeight
    });
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
        <div className="message-input-container" style={textAreaContainerStyle}>
          <textarea
            name="message"
            id="message-input"
            style={textAreaStyle}
            placeholder="Send a message. . . "
            onChange={this.handleChange}>
          </textarea>
          <i className="fas fa-chevron-circle-right send-message-icon"></i>
        </div>
    );
  }
}
