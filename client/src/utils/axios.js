import axios from 'axios';
// config
import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------
axios.defaults.headers.common = { 'Authorization': `bearer ${localStorage.getItem('accessToken')}` };

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;