import React, { useState } from 'react';

import { updateUser } from '../../services/authService';


const EditUserForm = ({ user, onSave, onCancel, token }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      password,
    };

    try {
      await updateUser(userData, user.id, token); 
      onSave(); 
    } catch (error) {
      console.error('Error updating user:', error);
      
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">
            Username:
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
            />
          </label>
        </div>
        <div>
          <label className="label">
            Password:
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </label>
        </div>
        <div className="button-group">
          <button type="submit" className="button">Save</button>
          <button type="button" className="button cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
