import { useEffect, useState, useRef } from 'react';
import axios from '../utils/axios';
/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useSpotBalance = (baseAsset, quoteAsset) => {
  const [balance, setBalance] = useState({});

  useEffect(() => {
    const fetchPrice = async () => {
      const res = await axios.post('/api/flight/getBalance', { baseAsset, quoteAsset });
      setBalance(res.data.balance);
      // console.log('Binance:', res.data.price);
    };
    // const interval = setInterval(() => {
    fetchPrice();
    // }, 20000);
    // return () => clearInterval(interval);
  }, [baseAsset, quoteAsset]);

  return balance;
};

export default useSpotBalance;
