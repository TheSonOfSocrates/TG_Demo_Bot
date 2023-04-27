require('dotenv').config();
const API_CREDENTIAL = {
  apiKey: 'KwMwg2KLHNxymEEe0MrnI0KMa65vQFIRmd4PTtFvZ9uy2RNwGIiXaPafSdE30RVK',
  secret: 'uiacRrBGllIT5LNXO5uL0zU2MnYoG5YbnK3sOiNINSe0jcG83m5ORCJCjOaJLMPB'
};

const BASE_API_URL = 'https://api.binance.com/api/v3/time';

module.exports = {
  API_CREDENTIAL,
  BASE_API_URL,
};