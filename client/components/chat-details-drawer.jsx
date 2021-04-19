import React from 'react';

export default function ChatDetailsDrawer(props) {
  return (
      <>
        <i className="fas fa-sign details-icon"></i>
        <div className="overlay details-drawer"></div>
          <div className="chat-details-drawer">
            <h3>Chat Room ID:</h3>
            {/* <p>{this.props.id}</p> */}
          </div>
      </>
  );
}
