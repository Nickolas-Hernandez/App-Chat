import React from 'react';

function ChatListItem(props) {
  return (
    <li className="chat-list-item">
      <h2>{props.roomTitle}</h2>
    </li>
  );
}

export default function ChatList(props) {
  const allRooms = props.rooms.map(room => {
    return <ChatListItem key={room.id} roomTitle={room.name}/>;
  });
  return <ul className="chat-list">{allRooms}</ul>;
}
