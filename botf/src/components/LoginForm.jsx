import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setStep }) => {
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [teleNumber, setTeleNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Parse query parameters and save to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const queryUsername = params.get('username');
    const queryUserId = params.get('userId');
    const queryFirstName = params.get('firstName');
    const queryLastName = params.get('lastName');

    // Save details in localStorage
    if (queryUsername) {
      localStorage.setItem('username', queryUsername);
      setUsername(queryUsername);
    }
    if (queryUserId) {
      localStorage.setItem('userId', queryUserId);
      setUserId(queryUserId);
    }
    if (queryFirstName && queryLastName) {
      const fullName = `${queryFirstName} ${queryLastName}`;
      localStorage.setItem('surname', fullName);
      setSurname(fullName);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log(surname, username, teleNumber, userId, 'Details for login');

      const response = await axios.post(`https://add-bot-server.vercel.app/api/user/register`, {
        surname,
        username,
        teleNumber,
        userId,
      });

      console.log('User logged in successfully:', response.data.message);

      // Save role and teleNumber to localStorage based on response
      if (response.data.message === 'Admin') {
        localStorage.setItem('role', 'admin');
      } else if (response.data.message === 'Agent') {
        localStorage.setItem('role', 'agent');
      } else {
        localStorage.setItem('role', 'user');
      }
      localStorage.setItem('teleNumber', teleNumber);

      setStep(1);
      navigate('/main');
    } catch (err) {
      console.error('Error during login:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your Username"
              required
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              Surname
            </label>
            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your Surname"
              required
            />
          </div>
          <div>
            <label htmlFor="teleNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Number
            </label>
            <input
              id="teleNumber"
              type="text"
              value={teleNumber}
              onChange={(e) => setTeleNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your Telegram Number"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  setStep: PropTypes.func.isRequired,
};

export default LoginForm;
