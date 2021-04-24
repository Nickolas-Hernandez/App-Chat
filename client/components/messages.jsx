import React from 'react';

export default function Messages(props) {
  console.log(props.messages);
  const allMessages = props.messages.map(message => {
    return (
      <Message
      key={message.messageId}
      message={message.message}
      sender={message.sender}
      thisUser={props.user}/>
    );
  });
  return (
    <div className="messages-view">
      <ul className="list-of-messages">{allMessages}</ul>
    </div>
  );
}

function Message(props) {
  const { thisUser, sender } = props;
  return (
    <li className={thisUser === sender ? 'message sent' : 'message recieved'}>
      <h4>{props.sender}</h4>
      <p>{props.message}</p>
    </li>
  );
}
