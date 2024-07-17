import React, { useState } from 'react';
import './Login.css'; // Make sure to create and import a CSS file for styling

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('lab-mantra');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== 'admin@gmail.com') {
      setError('The email is incorrect');
    } else if (password !== 'lab-mantra') {
      setError('The password is incorrect');
    } else {
        sessionStorage.setItem("labadminToken",true)
        window.location.href="/dashboard";
    }
  };

  return (
    <>
        <div className="main-login">
        <div className="login-container">
            <h2 className="login-title">Admin Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
                {error.includes('email') && <p className="error-text">{error}</p>}
                </div>
                <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                />
                {error.includes('password') && <p className="error-text">{error}</p>}
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
        </div>
    </>
  );
};

export default Login;
