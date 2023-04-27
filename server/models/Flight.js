const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FlightSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true
    },
    baseAsset: {
      type: String,
      required: true
    },
    quoteAsset: {
      type: String,
      required: true
    },
    amountAsset: {
      type: String
      // required: true,
    },
    decimal: {
      type: Number,
      required: true
    },
    startPosition: {
      type: Number,
      required: true
    },
    stepInterval: {
      type: Number,
      required: true
    },
    stepAmount: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: Number,
      required: true,
      default: 1
    },
    orders: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = Flight = mongoose.model('flights', FlightSchema);
