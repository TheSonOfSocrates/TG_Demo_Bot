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
  alerts: [],
  alert: {},
};

const slice = createSlice({
  name: 'alert',
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
    getAlertsSuccess(state, action) {
      state.isLoading = false;
      state.alerts = action.payload;
    },

    // GET PRODUCT
    getAlertSuccess(state, action) {
      state.isLoading = false;
      state.alert = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {} = slice.actions;

// ----------------------------------------------------------------------
// export function createFlight(data) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.post('/api/flight/create', data);
//       dispatch(slice.actions.getAlertsSuccess(response.data.flights));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

export function deleteAlert(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/alert/${id}`);
      dispatch(slice.actions.getAlertsSuccess(response.data.alerts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteAllAlerts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/alert/all`);
      dispatch(slice.actions.getAlertsSuccess(response.data.alerts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getNewAlerts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/alert/new');
      dispatch(slice.actions.getAlertsSuccess(response.data.alerts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

// export function getFlight(id) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get(`/api/flight/get/${id}`);
//       dispatch(slice.actions.getFlightSuccess(response.data.flight));
//       console.log(response.data.flight);
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
