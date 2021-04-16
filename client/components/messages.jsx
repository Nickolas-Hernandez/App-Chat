import React from 'react';

export default function Messages(props) {
  const allMessages = props.messages.map(message => {
    let key = 0;
    const item = <MessagesList key={key} message={message.message} />;
    key++;
    return item;
  });
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
