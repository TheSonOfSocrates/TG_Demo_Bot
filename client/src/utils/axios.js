import axios from 'axios';
// config
import { SERVER_URL } from '../config-global';

const axiosInstance = axios.create({ baseURL: SERVER_URL });

var lastNotifyTime = 0;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 507 && new Date().getTime() - lastNotifyTime > 60000) {
      alert('You need to input Binance key and secret to use bot.');
      lastNotifyTime = new Date().getTime();
    }
  },
);

export default axiosInstance;