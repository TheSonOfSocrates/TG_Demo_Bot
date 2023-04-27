import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useBinancePrice = (symbol) => {
  const [price, setPrice] = useState();
  const endpoint = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  useEffect(() => {
    const fetchPrice = async () => {
      const res = await axios.get(endpoint);
      setPrice(Number(res.data.price));
      // console.log('Binance:', res.data.price);
    };
    const interval = setInterval(() => {
      fetchPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, [endpoint, symbol]);

  return price;
};

export default useBinancePrice;
