import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import Shufflebox from './Shufflebox';
function Navbar() {
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(true);
  const [iscloseForm, setClostForm] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [handledErrors, setHandledErrors] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn'));
  const [inputValue, setInputValue] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [SearchResults, setSearchResults] = useState([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);


  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      if (selectedResultIndex !== -1) {
        // Check if a result is selected
        const selectedResult = SearchResults[selectedResultIndex];
        navigate(`/VideoPage/${encodeURIComponent(selectedResult.title)}/${selectedResult.id}`);
      } else if (inputValue.trim() !== '') {
        try {
          const response = await fetch(`http://localhost:8081/search?q=${encodeURIComponent(inputValue)}`);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          // Check if data is an array before calling setSearchResults
          if (Array.isArray(data)) {
            setSearchResults(data);
            console.log('Fetched data1:', data);
          } else {
            console.error('Error: Fetched data is not an array.');
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      }
    }

    if (event.key === 'ArrowUp') {
      // Handle up arrow key press
      event.preventDefault();
      setSelectedResultIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (event.key === 'ArrowDown' && selectedResultIndex < SearchResults.length - 1) {
      // Handle down arrow key press
      event.preventDefault();
      setSelectedResultIndex((prevIndex) => prevIndex + 1);
    } else if (event.key === 'Escape') {
      // Handle Escape key press to close results
      event.preventDefault();
      setShowInstructions(false);
      setSearchResults([]); // Clear search results
      setSelectedResultIndex(-1); // Reset selected index
      event.target.blur();
    }
  };



  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.trim() !== '') {

      try {
        // Example: Fetch data from an API (replace URL with your actual API endpoint)
        const response = await fetch(`http://localhost:8081/search?q=${encodeURIComponent(value)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setSearchResults(data);
          console.log('Fetched data1:', data);
        } else {
          console.error('Error: Fetched data is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      // Handle arrow key navigation here
      if (event.key === 'ArrowUp' && selectedResultIndex > 0) {
        setSelectedResultIndex(selectedResultIndex - 1);

      } else if (event.key === 'ArrowDown' && selectedResultIndex < SearchResults.length - 1) {
        setSelectedResultIndex(selectedResultIndex + 1);
      }
    }
  };


  const handleInputFocus = () => {
    setShowInstructions(true);
  };

  const handleInputBlur = () => {
    // Introduce a small delay before closing the results
    setTimeout(() => {
      setShowInstructions(false);
      setSearchResults([]); // Clear search results
      setSelectedResultIndex(-1); // Reset selected index
    }, 200); // You can adjust the delay (in milliseconds) based on your needs
  };


  const toggleAuthForm = () => {
    setLogin(!isLogin);
    if (!isLogin) {
      setHandledErrors('Welcome back');
    } else {
      setHandledErrors('Create an account');
    }
  };

  const AuthFormClose = () => {
    setClostForm(!iscloseForm);
  };

  const LogoutButton = async () => {
    try {
      const response = await fetch('http://localhost:8081/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials for cross-origin requests
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('email');
        localStorage.removeItem('userid');
        setIsLoggedIn(false);
        navigate('/');

        // Logout successful, perform any additional actions (e.g., redirect)
        console.log('Logout successful');
      } else {
        // Logout failed, handle the error
        console.error('Error during logout:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };



  const handleRegister = async () => {
    if (!isLogin && password !== confirmPassword) {
      setHandledErrors('Passwords do not match');
      console.error('Passwords do not match');
      // You can show an error message or take appropriate action
      return;
    }

    try {
      const url = isLogin ? 'http://localhost:8081/login' : 'http://localhost:8081/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          // Add other necessary fields for registration
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Registration or login successful, you can redirect or show a success message
        if (data.isLoggedIn) {
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(localStorage.getItem('isLoggedIn'));
          localStorage.setItem('email', `${data.email}`)
          localStorage.setItem('userid', `${data.user_id}`)
          navigate('/');
          AuthFormClose();
        }
        console.log(`${isLogin ? 'Login' : 'Registration'} successful`);
      } else {
        // Handle registration or login failure, show an error message or take appropriate action
        console.log(`${isLogin ? 'Login' : 'Registration'} failed:`, data.message);
        setHandledErrors(data.message);
      }
    } catch (error) {
      console.error(`Error during ${isLogin ? 'login' : 'registration'}:`, error.message);
    }
  };

  return (
    <><header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink className="navbar-brand" to="/">
          ANIMEKI
        </NavLink>
        <div className="search-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search anime"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                />
                <div className="search-icon">
                  <i className="fas fa-search"></i>
                </div>
              </div>



              {showInstructions && (
                <div className="results">

                  <div className="search-results-container">
                    {SearchResults.map((data, index) => (
                      <NavLink className="rank-link" to={`/VideoPage/${encodeURIComponent(data.title)}/${data.paraid}`} >
                        <Shufflebox
                          key={data.showid}
                          imageUrl={`/images/card-poster${data.showid}.jpg`}
                          title={data.title}
                          Season={data.season}
                          TotalEpisodes={data.total_episodes}
                          Date={data.Date}
                          paraid={data.id}
                          isSelected={index === selectedResultIndex}
                        />
                      </NavLink>
                    ))}

                  </div>
                  <div className="instruction-box">
                    <p>To search</p> <i className="fas fa-arrow-circle-right"></i>
                    <p>To navigate</p> <i className="fas fa-up-down"></i>
                    <p>To exit</p> <i className="fas fa-times-circle"></i>
                  </div>
                </div>
              )}
            </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
                
          <ul className="navbar-nav ml-auto">
        
            <li className="nav-item">
              <NavLink className="nav-link" to="/" >
                Home <i className="fas fa-home icons"></i>
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link "
                to="/genre"
                role="button"

              >
                Genre <i className="fas fa-microphone icons"></i>
              </NavLink>

            </li>


            {!isLoggedIn ? (
              <li className="nav-item">
                <button className='nav-button' onClick={AuthFormClose}>Sign in <i className="fa-solid fa-arrow-right"></i></button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <button className='nav-button' onClick={LogoutButton}>Logout <i className="fa-solid fa-arrow-right"></i></button>
                </li>
                <li className="nav-item">
                  <i className="fas fa-user icons"></i>
                </li>
              </>

            )}

          </ul>
          <div className="search-small-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search anime"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                />
                <div className="search-icon">
                  <i className="fas fa-search"></i>
                </div>
              </div>



              {showInstructions && (
                <div className="results">

                  <div className="search-results-container">
                    {SearchResults.map((data, index) => (
                      <NavLink className="rank-link" to={`/VideoPage/${encodeURIComponent(data.title)}/${data.paraid}`} >
                        <Shufflebox
                          key={data.showid}
                          imageUrl={`/images/card-poster${data.showid}.jpg`}
                          title={data.title}
                          Season={data.season}
                          TotalEpisodes={data.total_episodes}
                          Date={data.Date}
                          paraid={data.id}
                          isSelected={index === selectedResultIndex}
                        />
                      </NavLink>
                    ))}

                  </div>
                  <div className="instruction-box">
                    <p>To search</p> <i className="fas fa-arrow-circle-right"></i>
                    <p>To navigate</p> <i className="fas fa-up-down"></i>
                    <p>To exit</p> <i className="fas fa-times-circle"></i>
                  </div>
                </div>
              )}
            </div>      
        </div>
      </nav>
    </header>

      {!iscloseForm && (

        <div className={`auth-container`}>

          <div className="auth-box">
            {/* Left Side (Image) */}
            <div className="auth-left-side">
              <img
                src={isLogin ? '/images/luffy.png' : '/images/luffy2.png'}
                alt="Left Side Image"
              />
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
                    <p>{handledErrors}</p>
                    <div className="mb-3">
                      <div className="input-with-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                          required
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-with-icon">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Register</h2>
                    <p>{handledErrors}</p>
                    <div className="mb-3">
                      <div className="input-with-icon">
                        <i className="fas fa-user"></i>
                        <input
                          required
                          type="user"
                          className="form-control"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder="User Name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-with-icon">
                        <i className="fas fa-envelope"></i>
                        <input
                          required
                          type="email"
                          className="form-control"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-with-icon">
                        <i className="fas fa-lock"></i>
                        <input
                          required
                          type="password"
                          className="form-control"
                          id="Password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-with-icon">
                        <i className="fas fa-lock"></i>
                        <input
                          required
                          type="password"
                          className="form-control"
                          id="Confirm Password"
                          aria-describedby="emailHelp"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* Add your login form fields here */}
                <button type="submit" onClick={handleRegister} className="auth-button">
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
}

export default Navbar;
