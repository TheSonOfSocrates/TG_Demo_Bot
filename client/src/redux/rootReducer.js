import { combineReducers } from 'redux';
// slices
import flightReducer from './slices/flight';
import alertReducer from './slices/alert';

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  flight: flightReducer,
  alert: alertReducer,
});

export default rootReducer;
