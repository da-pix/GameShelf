import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);

  const logged = !!user;


  useEffect(() => {
    if (logged) {
      navigate('/');
      return;
    }
  }, []);

  // Handle username availability check
  const checkUsername = async (username) => {
    try {
      const res = await axios.post('http://localhost:8800/check-username', { username });
      setIsUsernameAvailable(!res.data.exists);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form submission for sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isUsernameAvailable) {
      setFeedback('Username is already taken.');
      return;
    }

    if (password.length < 8) {
      setFeedback('Password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8800/signup', { username, password });
      setFeedback(res.data);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setFeedback('Error signing up.');
    }
  };

  // Handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8800/login', { username, password });
      const { userID, username: loggedInUsername, isAdmin, shelfID } = response.data;
      console.log(response.data);
      setUser({ userID, username: loggedInUsername, isAdmin, shelfID });
      localStorage.setItem('user', JSON.stringify({ userID, username: loggedInUsername, isAdmin, shelfID }));
      console.log('User logged in:', loggedInUsername);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check your credentials.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setUsername('');
    setPassword('');
    setFeedback('');
    setIsUsernameAvailable(null);
  };

  return (
    <div className="login-container">
      <h1>{isSignUp ? 'Sign Up' : 'Log In'}</h1>
      <form className="login-form-group" onSubmit={isSignUp ? handleSignUp : handleLogin}>
        <div className='input-con'>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            maxLength={20}
            onChange={(e) => {
              setUsername(e.target.value);
              if (isSignUp) {
                checkUsername(e.target.value);
              }
            }}
            required
          />
          {isSignUp && (
            <span className={`availability ${isUsernameAvailable ? 'available' : 'unavailable'}`}>
              {isUsernameAvailable === null
                ? ''
                : isUsernameAvailable
                  ? 'Username is available.'
                  : 'Username is already taken.'}
            </span>
          )}
        </div>
        <label htmlFor="password">Password</label>
        <div className='password-container'>
          <input
            type="password"
            id="password"
            value={password}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <p className="feedback">{feedback}</p>
      <button className="toggle-button" onClick={toggleMode}>
        {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};

export default Login;