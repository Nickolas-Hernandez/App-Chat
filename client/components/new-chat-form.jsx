import React from 'react';

export default class NewChatForm extends React.Component {

  render() {
    return (
      <>
        <div className="overlay">
          <form className="new-chat-form">
            <h3 className="form-tab active">Create</h3>
          </form>
        </div>
      </>
    );
  }
}
