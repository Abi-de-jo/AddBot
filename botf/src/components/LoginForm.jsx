import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setStep }) => {
   const [username, setusername] = useState('');
  const [surname, setsurname] = useState('');
  const [teleNumber, setteleNumber] = useState('');
   const [error, setError] = useState(''); // To display error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Reset error message

    

    try {
      const response = await axios.post(`https://add-bot-server.vercel.app/api/user/register`, {
        surname,
                username,
        teleNumber,
       });

      console.log('User logged in successfully:', response.data.message);

      // Save role and email to localStorage based on response message
      if (response.data.message === 'Admin') {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('teleNumber', teleNumber);
      } else if (response.data.message === 'Agent') {
        localStorage.setItem('role', 'agent');
        localStorage.setItem('teleNumber', teleNumber);
      } else {
        localStorage.setItem('role', 'user');
        localStorage.setItem('teleNumber', teleNumber);
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              UserName
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
               className={`w-full px-4 py-2 border ${
                error && !username ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your Name"
              required
            />
            {error && !username && (
              <p className="text-sm text-red-500 mt-1">Email is required.</p>
            )}
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              Surname
            </label>
            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setsurname(e.target.value)}
               className={`w-full px-4 py-2 border ${
                error && !surname ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your Surname "
              required
            />
            {error && !surname && (
              <p className="text-sm text-red-500 mt-1">Email is required.</p>
            )}
          </div>


          <div>
            <label htmlFor="teleNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Number
            </label>
            <input
              id="teleNumber"
              type="teleNumber"
              value={teleNumber}
              onChange={(e) => setteleNumber(e.target.value)}
               className={`w-full px-4 py-2 border ${
                error && !teleNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your teleNumber"
              required
            />
            {error && !teleNumber && (
              <p className="text-sm text-red-500 mt-1">teleNumber is required.</p>
            )}
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
