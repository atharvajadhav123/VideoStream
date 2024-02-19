import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setLogin] = useState(true);
  const [iscloseForm, setClostForm] = useState(true);
  const toggleAuthForm = () => {
    setLogin(!isLogin);
  };

  const AuthFormClose = () => {
    setClostForm(!iscloseForm);
   };

  return (
    <>
      {iscloseForm&&(

        <div className={`auth-container`}>
        <div className="auth-box">
          {/* Left Side (Image) */}
          <div className="auth-left-side">
            <img src="/images/luffy.png" alt="Left Side Image" />
          </div>

          {/* Right Side (Login Form) */}
          <div className="auth-right-side">
            <div className="close-button" onClick={AuthFormClose}>
              X
            </div>
            <div className="auth-form">
              {isLogin ? (
                <>
                  <h2>Login</h2>
                  <p>Welcome back</p>
                  <div className="mb-3">
                    <i className="fas fa-envelope"></i>
                    <div className="input-with-icon">
                      <input
                        type="email"
                        className="form-control-login"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder=" Email address "
                        />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        className="form-control-login"
                        id="exampleInputPassword1"
                        placeholder="Enter your password"
                        />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2>Register</h2>
                  <p>Create an account</p>
                  <div className="mb-3">
                    <div className="input-with-icon">
                      <i className="fas fa-user"></i>
                      <input
                        type="user"
                        className="form-control"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="User Name"
                        />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-with-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Email address"
                        />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        className="form-control"
                        id="Password"
                        placeholder="Enter your password"
                        />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        className="form-control"
                        id="Confirm Password"
                        aria-describedby="emailHelp"
                        placeholder="Confirm Password"
                        />
                    </div>
                  </div>
                </>
              )}
              {/* Add your login form fields here */}
              <button className="auth-button">
                {isLogin ? 'Login' : 'Register'}
              </button>
              <div className="auth-register">
                <p>
                  {isLogin
                    ? "If you don't have an account"
                    : 'If you already have an account'}
                  <b onClick={toggleAuthForm}>
                    {isLogin ? ' Register' : ' Login'}
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
        )}
    </>
  );
};

export default AuthForm;
