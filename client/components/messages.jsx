import React from 'react';

export default function Messages(props) {
  const allMessages = props.messages.map(message => {
    return (
      <MessagesList
      key={message.messageId}
      message={message.message} />
    );
  });
  allMessages.reverse();
  return (
    <div className="messages-view">
      <ul className="list-of-messages">{allMessages}</ul>
    </div>
  );
}

function MessagesList(props) {
  return (
    <li className={'message'}>{props.message}</li>
  );
}
