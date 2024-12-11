import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const LoginForm = ({setStep}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
     try {
      const response = await axios.post(`https://add-bot-server.vercel.app/api/user/register`, {
        email,
        password,
      });
      localStorage.setItem("email",email)
      console.log("Admin created successfully:", response.data);
      setStep(1)
      } catch (err) {
      console.error("Error during admin creation:", err.response?.data || err.message);
    }  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Telegram Login</h1>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
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

// Define propTypes for the LoginForm component
LoginForm.propTypes = {
  setStep: PropTypes.func.isRequired, // Ensures setStep is passed and is a function
};

export default LoginForm;
