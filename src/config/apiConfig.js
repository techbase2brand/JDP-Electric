import axios from 'axios';

export const API_BASE_URL = 'https://jdpbackend.prorevv.com/api';
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;

/* axios instance */

//Login API
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send OTP
export const sendForgotPasswordOtp = async email => {
  try {
    const res = await api.post('/auth/forgot-password/send-otp', {email});
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// Verify OTP
export const verifyForgotPasswordOtp = async (email, otp) => {
  try {
    const res = await api.post('/auth/forgot-password/verify-otp', {
      email,
      otp,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// Resend OTP
export const resendForgotPasswordOtp = async email => {
  try {
    const res = await api.post('/auth/forgot-password/resend-otp', {email});
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// Reset Password
export const resetForgotPassword = async (
  email,
  newPassword,
  confirmPassword,
) => {
  try {
    const res = await api.post('/auth/forgot-password/reset', {
      email,
      newPassword,
      confirmPassword,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// Logout API
export const logoutApi = async token => {
  console.log('tokentoken', token);

  try {
    const res = await api.post(
      '/auth/logout',
      {token},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};
