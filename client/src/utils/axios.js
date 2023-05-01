import axios from 'axios';
// config
import { SERVER_URL } from '../config-global';

var lastDBNotificationTime = 0;

// ----------------------------------------------------------------------
axios.defaults.headers.common = { 'Authorization': `bearer ${localStorage.getItem('accessToken')}` };

const axiosInstance = axios.create({ baseURL: SERVER_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 503 && new Date().getTime() - lastDBNotificationTime > 60000) {
      alert('You need to connect to database first.');
      lastDBNotificationTime = new Date().getTime();
    }
  },
);

export default axiosInstance;