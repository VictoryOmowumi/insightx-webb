import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc'; // Google icon
import { baseUrl } from '@/utils/baseUrl';
import loginBg from '@/assets/loginBg.svg';
import logo from '@/assets/insightLight.svg';
import logo2 from '@/assets/insightDark.svg';
import { useTheme } from 'next-themes';
const Login = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    // clear any previous token and user from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    try {
      await login(data);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  // Redirect to backend Google OAuth endpoint
  const handleGoogleLogin = () => {
    setIsGoogleLoggingIn(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = `${baseUrl}auth/google`;
  };

  return (
    <div className="bg-custom-gradient  h-screen overflow-clip p-5">
      <div className="flex gap-2 flex-col md:flex-row justify-between w-full md:w-11/12 mx-auto h-full ">
        <div className="flex-[2] flex flex-col space-y-5  ">
          <img src={theme === 'dark' ? logo2 : logo} alt="logo" className="w-40 " />
          <div className="flex flex-col space-y-5 justify-center items-center h-full">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-4xl font-medium">Welcome to InsightX</h1>
              <p className="text-[#444444] dark:text-neutral-400">Login to experience more</p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 w-full md:w-lg"
            >
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[#444444] ml-2">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="me.you@sevenup.org"
                  className={`!p-3  bg-[#F4F3F1] dark:bg-neutral-700 rounded-4xl ${
                    errors.password ? 'border border-red-500' : ''
                  }
                  `}
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs ml-2">{errors.email.message}</span>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-[#444444] ml-2">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className={`!p-3  bg-[#F4F3F1] dark:bg-neutral-700 rounded-4xl ${
                    errors.password ? 'border border-red-500' : ''
                  }
                  `}
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs ml-2">{errors.password.message}</span>
                )}
              </div>
              <button
                type="submit"
                className={`!p-3 bg-[#F1B712] dark:bg-[#f1b612e2] text-black font-medium rounded-4xl hover:bg-[#f1b6129d] focus:outline-none focus:ring-2 flex items-center justify-center focus:ring-gray-500 transition-colors duration-300 ease-in-out ${isSubmitting ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
            {/* Divider */}
            <div className="flex items-center justify-center w-full md:w-lg">
              <div className="border-t border-[#73737371] flex-grow"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="border-t border-[#73737371] flex-grow"></div>
            </div>
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoggingIn}
              className={`w-full md:w-lg px-4 !p-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-black dark:border-neutral-400 rounded-4xl hover:bg-[#1a1a1a] hover:dark:bg-neutral-700 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center transition-colors duration-300 ease-in-out ${isGoogleLoggingIn ? '!cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isGoogleLoggingIn ? (
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FcGoogle className="w-5 h-5 mr-2" />
              )}
              {isGoogleLoggingIn ? 'Logging in...' : 'Login with Google'}
            </button>

          </div>
        </div>
        <div className="flex-[2] w-full h-full hidden md:flex rounded-4xl"
          style={{ backgroundImage: `url(${loginBg})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Login;

