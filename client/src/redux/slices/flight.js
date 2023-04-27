import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  flights: [],
  flight: {},
  balance: {},
  totalProfit: [],
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    totalItems: 0,
  },
};

const slice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getFlightsSuccess(state, action) {
      state.isLoading = false;
      state.flights = action.payload;
    },

    // GET PRODUCT
    getFlightSuccess(state, action) {
      state.isLoading = false;
      state.flight = action.payload;
    },

    getBalanceSuccess(state, action) {
      state.isLoading = false;
      state.balance = action.payload;
    },

    getTotalProfitSuccess(state, action) {
      state.isLoading = false;
      state.totalProfit = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;

// ----------------------------------------------------------------------
export function createFlight(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/flight/create', data);
      dispatch(slice.actions.getFlightsSuccess(response.data.flights));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateFlight(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/api/flight', data);
      // dispatch(slice.actions.getFlightsSuccess(response.data.flights));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteFlight(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/flight/${id}`);
      dispatch(slice.actions.getFlightsSuccess(response.data.flights));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteStep(flightId, stepId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/flight/step/${flightId}/${stepId}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getFlights() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/flight/get');
      dispatch(slice.actions.getFlightsSuccess(response.data.flights));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFlight(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/flight/get/${id}`);
      dispatch(slice.actions.getFlightSuccess(response.data.flight));
      dispatch(slice.actions.getBalanceSuccess(response.data.balance));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTotalProfit() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/flight/getTotalProfit`);
      dispatch(slice.actions.getTotalProfitSuccess(response.data.totalProfit));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
