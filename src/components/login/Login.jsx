import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import '../login/styles/login.css';
import { login } from '../../services/authService';


export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loginData = {
        username: username,
        password: password,
      };

      const result = await login(loginData);

      if (result && result.token) {
        dispatch(setUser({
          username: result.username,
          role: result.role,
          token: result.token,
          roleEntity: result.roleEntity,
        }));
        navigate('/home');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      setError('Error durante el inicio de sesión');
    }
  };


  const handleIrAtras=()=>{
    setShowFaceRecognition(false)
  }

  return (
    <div className="styled-wrapper">
        <div className="card">
          <div className="card2">
            <form className="form" onSubmit={handleLogin}>
              <p id="heading">Iniciar sesión</p>
              <div className="field">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Username"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="btn">
                <button className="button1" type="submit">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Iniciar sesion&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default Login;
