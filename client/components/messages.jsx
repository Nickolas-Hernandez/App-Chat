import React from 'react';

export default function Messages(props) {
  let key = 0;
  const allMessages = props.messages.map(message => {
    const item = <MessagesList key={key} message={message.message} />;
    key++;
    return item;
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
