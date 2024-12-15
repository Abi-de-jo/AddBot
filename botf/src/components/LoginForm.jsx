import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setStep }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Reset error message

    // Validate minimum password length
    // if (password.length < 6) {
    //   setError('Password must be at least 6 characters long.');
    //   return;
    // }

    try {
      const response = await axios.post(`http://localhost:3000/api/user/register`, {
        email,
        password,
      });

      console.log('User logged in successfully:', response.data.message);

      // Save role and email to localStorage based on response message
      if (response.data.message === 'Admin') {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('email', email);
      } else if (response.data.message === 'Agent') {
        localStorage.setItem('role', 'agent');
        localStorage.setItem('email', email);
      } else {
        localStorage.setItem('role', 'user');
        localStorage.setItem('email', email);
      }

      setStep(1);
      navigate('/main');
    } catch (err) {
      console.error('Error during login:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 border ${
                error && !email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your email"
            />
            {error && !email && (
              <p className="text-sm text-red-500 mt-1">Email is required.</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 border ${
                error && password.length < 6 ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your password"
            />
            {error && password.length < 6 && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          {error && email && password.length >= 6 && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

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

// Define propTypes for the LoginForm component
LoginForm.propTypes = {
  setStep: PropTypes.func.isRequired, // Ensures setStep is passed and is a function
};

export default LoginForm;
