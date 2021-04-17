import React from 'react';

export default class CreateUserForm extends React.Component {
  render() {
    return (
      <>
        <div
          className='overlay'>
          <form className="new-user-form">
            <h3 className="welcome-message">Hi! Welcome to Chat-App!</h3>
            <label htmlFor="user-name">Enter your name:</label>
            <input
              type="text"
              name="user-name"
              id="user-name"
              required/>
            <button>Submit</button>
          </form>
        </div>
      </>
    );
  }
}
