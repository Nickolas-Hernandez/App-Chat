import React from 'react';

export default function Messages(props) {
  const allMessages = props.messages.map(message => {
    return (
      <Message
      key={message.messageId}
      message={message.message} />
    );
  });
  return (
    <div className="messages-view">
      <ul className="list-of-messages">{allMessages}</ul>
    </div>
  );
}

function Message(props) {
  return (
    <li className={'message'}>{props.message}</li>
  );
}
