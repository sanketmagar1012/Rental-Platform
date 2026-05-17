import axios from 'axios';

export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response;
};

export const login = async (userData) => {
  const response = await axios.post('/auth/login', userData);
  return response;
};

export const googleLoginService = async (credential, role) => {
  const response = await axios.post('/auth/google-login', { credential, role });
  return response.data;
};

export const completeProfileService = async (phoneNumber, city) => {
  const response = await axios.post('/auth/complete-profile', { phoneNumber, city });
  return response.data;
};
