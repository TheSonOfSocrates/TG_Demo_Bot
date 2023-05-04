import axios from 'axios';
// config
import { SERVER_URL } from '../config-global';

// ----------------------------------------------------------------------
axios.defaults.headers.common = { 'Authorization': `bearer ${localStorage.getItem('accessToken')}` };

const axiosInstance = axios.create({ baseURL: SERVER_URL });

export default axiosInstance;