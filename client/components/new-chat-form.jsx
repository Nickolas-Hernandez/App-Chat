import React from 'react';

export default class NewChatForm extends React.Component {

  render() {
    return (
      <>
        <div className="overlay">
          <form className="new-chat-form">
            <h3 className="form-tab active">Create</h3>
            <label htmlFor="chat-name">Enter chat name:</label>
            <input type="text" name="chat-name" id="chat-name"/>
            <label htmlFor="users-name">Enter your name:</label>
            <input type="text" name="users-name" id="users-name"/>
            <input type="submit" value="Submit" className="submit-button" />
          </form>
        </div>
      </>
    );
  }
}
