import axios from 'axios';

export const getProperties = async (filters = {}) => {
  const response = await axios.get('/properties', { params: filters });
  return response.data;
};

export const getProperty = async (id) => {
  const response = await axios.get(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (formData) => {
  const response = await axios.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
