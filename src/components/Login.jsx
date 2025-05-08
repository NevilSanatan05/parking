import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);

        if (userCredential.user.email === 'admin@example.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        setError('Invalid email or password.');
        console.error(err.message);
      });
  };

  const handleGoogleLogin = () => {
    setError('');

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);

        if (user.email === 'admin@example.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        setError('Google login failed: ' + err.message);
        console.error(err.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login to Your Account</h2>
        <p className="text-center text-gray-600 text-sm">
          Welcome back! Please login to manage your traffic.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            Log In
          </button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <div className="relative">
            <hr className="border-gray-300" />
            <span className="absolute left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-500"></span>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition duration-200"
          >
            <span className="flex items-center justify-center space-x-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png" alt="Google logo" className="w-5 h-5" />
              <span>Log in with Google</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;