import { useEffect, useState, useRef } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { PATH_AUTH } from '../routes/paths';

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useSpotBalance = (baseAsset, quoteAsset) => {
  const [balance, setBalance] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrice = async () => {
      const res = await axios.post('/api/flight/getBalance', { baseAsset, quoteAsset });
      if (res) {
        setBalance(res.data.balance);
        // console.log('Binance:', res.data.price);
      } else {
        alert('Your Binance key and secret isn\'t correct.');
        navigate('/dashboard/flight/list', { replace: true });
      }
    };
    // const interval = setInterval(() => {
      fetchPrice();
    // }, 20000);
    // return () => clearInterval(interval);
  }, [baseAsset, quoteAsset]);

  return balance;
};

export default useSpotBalance;
