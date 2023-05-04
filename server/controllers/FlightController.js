const ccxt = require('ccxt');
const cron = require('node-cron');
const { flatten, groupBy, sumBy } = require('lodash');
const Flight = require('../models/Flight');
const { fCorrectNumber, fFloatFloor } = require('../utils/FormatNumber');

// (async () => {
//   await binance.loadMarkets();
// })();

exports.getDatas = async (req, res) => {
  let currencies = binance.currencies;
  res.json({ currencies });
};

const errorMessage = (e) => {
  return JSON.parse(e.message.slice(8)).msg;
};

//--------------------------------- Binance Functions --------------------------------------//
const binanceSell = async (symbol, amount, price, flightId, params) => {
  try {
    const res = await binance.createLimitSellOrder(symbol, amount, fCorrectNumber(price), params);
    console.log('Limit Sell ------>', symbol, res.amount, res.price, res.id, res.info.status);
    await addOrderToFlight(flightId, res);
  } catch (e) {
    console.log('Limit Sell Error --------->', JSON.parse(e.message.slice(8)).msg);
    await addOrderToFlight(flightId, { side: 'sell' }, errorMessage(e));
  }
};

const binanceBuy = async (symbol, amount, price, flightId, params) => {
  try {
    const res = await binance.createLimitBuyOrder(symbol, amount, fCorrectNumber(price), params);
    console.log('Limit Buy ------>', symbol, res.amount, res.price, res.id, res.info.status);
    await addOrderToFlight(flightId, res);
  } catch (e) {
    console.log('Limit Buy Error --------->', JSON.parse(e.message.slice(8)).msg);
    await addOrderToFlight(flightId, { side: 'sell' }, errorMessage(e));
  }
};
//--------------------------------------------------------------------------------------------//

const addOrderToFlight = async (flightId, order, error) => {
  const { id, side, info, price, amount, cost, average, filled, remaining, type } = order;
  const orderObject = {
    id,
    side,
    type,
    status: info?.status,
    realStatus: 'NEW',
    price,
    amount,
    cost,
    average,
    filled,
    remaining,
    error
  };
  await Flight.findOneAndUpdate(
    { _id: flightId },
    {
      $push: {
        orders: orderObject
      }
    }
  );
};

const cancelAllOrdersByFlightId = async (flightId) => {
  try {
    const flight = await Flight.findOne({ _id: flightId });
    let newOrderIds = [];
    let partialOrders = [];
    for (let step of flight.steps) {
      for (let order of step.orders) {
        if (order.status == 'NEW') {
          newOrderIds.push(order.id);
        } else if (order.status == 'PARTIALLY_FILLED') {
          partialOrders.push({ orderId: order.id, stepId: step.id });
        }
      }
    }

    console.log(newOrderIds, ' are canceled!');

    for (let orderId of newOrderIds) {
      await binance.cancelOrder(orderId, flight.symbol);
      await updateOrderStatus(flightId, orderId, 'CANCELED');
    }

    for (let order of partialOrders) {
      const partialOrderRes = await binance.fetchOrder(order.orderId, flight.symbol);
      const { side, filled } = partialOrderRes;
      await binance.cancelOrder(order.orderId, flight.symbol);
      if (side == 'sell') {
        await binanceMarketBuy(flight.symbol, filled, flightId, order.stepId);
      } else if (side == 'buy') {
        await binanceMarketSell(flight.symbol, filled, flightId, order.stepId);
      }
      await updateOrderStatus(flightId, order.orderId, 'CANCELED');
    }
  } catch (error) {
    console.log('Error ------->', error);
  }
};

exports.createFlight = async (req, res) => {
  const { pair, startPosition, stepInterval, stepAmount, amountAsset } = req.body;

  console.log('--------------------------Start NewBot-------------------------------');
  const precision = binance.markets[pair.market].precision.price;
  const newFlight = new Flight({
    symbol: pair.symbol,
    baseAsset: pair.baseAsset,
    quoteAsset: pair.quoteAsset,
    decimal: precision,
    amountAsset,
    startPosition,
    stepInterval,
    stepAmount,
    fee: pair.fee
  });
  await newFlight.save();

  // ------------------- Making First Limit Order -------------------- //
  await binanceSell(pair.symbol, stepAmount, startPosition + stepInterval, newFlight._id);
  await binanceBuy(pair.symbol, stepAmount, startPosition - stepInterval, newFlight._id);

  const flights = await Flight.find();
  res.json({ flights });
};

exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json({ flights });
  } catch (e) {
    res.json({ msg: e.toString() });
  }
};

exports.getFlightById = async (req, res) => {
  const { id } = req.params;
  const flight = await Flight.findById(id);
  const balance = await binance.fetchBalance();
  const symbolBalance = { baseAsset: balance[flight.baseAsset], quoteAsset: balance[flight.quoteAsset] };
  res.json({ flight, balance: symbolBalance });
};

exports.getBalance = async (req, res) => {
  const { baseAsset, quoteAsset } = req.body;
  const balance = await binance.fetchBalance();
  const symbolBalance = { baseAsset: balance[baseAsset], quoteAsset: balance[quoteAsset] };
  res.json({ balance: symbolBalance });
};
