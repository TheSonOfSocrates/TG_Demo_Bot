import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
import { SERVER_URL } from '../config-global';
//
import { isValidToken, setSession, jwtDecode } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  licenseKey: '',
  isValidLicenseKey: false,
  remains: 0,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      isValidLicenseKey: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  if (action.type === 'SET_LICENSE_KEY') {
    return {
      ...state,
      licenseKey: action.payload.licenseKey,
    };
  }
  if (action.type === 'IS_VALID_LICENSE_KEY') {
    return {
      ...state,
      isValidLicenseKey: action.payload.isValidLicenseKey,
      remains: action.payload.remains,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // const response = await axios.get('/api/account/my-account');
        // const { user } = response.data;
        const user = jwtDecode(accessToken);
        console.log(user);

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {

    let loginUrl = SERVER_URL;
    if (SERVER_URL.endsWith('/')) {
      loginUrl += 'api/user/login';
    } else {
      loginUrl += '/api/user/login';
    }

    const response = await axios.post(loginUrl, {
      email,
      password,
    });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  // LOGIN
  const fakeLogin = useCallback(async () => {
    const user = { name: process.env.REACT_APP_USER };

    setSession(process.env.REACT_APP_TOKEN);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/user/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // CHANGE LICENSE KEY
  const changeLicenseKey = useCallback(async (licenseKey) => {
    dispatch({
      type: 'SET_LICENSE_KEY',
      payload: {
        licenseKey
      },
    });

    const response = await axios.post('/api/user/change-license-key', {licenseKey});

    if (response.status === 200 && response.data.success) {
      console.log("License key changed successfully.");
    } else {
      console.log("License key didn't changed.");
    }
  }, []);

  // GET LICENSE KEY
  const getLicenseKey = useCallback(async () => {
    const response = await axios.post('/api/user/get-license-key');

    if (response.status === 200) {
      const { licenseKey, validationInfo } = response.data;
      dispatch({
        type: 'SET_LICENSE_KEY',
        payload: {
          licenseKey
        },
      });
      
      const { isValidLicenseKey, remains } = validationInfo;
      dispatch({
        type: 'IS_VALID_LICENSE_KEY',
        payload: {
          isValidLicenseKey,
          remains
        },
      });
    }
  }, []);

  // GET LICENSE KEY
  const checkLicenseKey = useCallback(async (licenseKey) => {
    const response = await axios.post('/api/user/check-license-key', {licenseKey});

    if (response.status === 200) {
      const { validationInfo } = response.data;
      
      const { isValidLicenseKey, remains } = validationInfo;
      dispatch({
        type: 'IS_VALID_LICENSE_KEY',
        payload: {
          isValidLicenseKey,
          remains
        },
      });
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      isValidLicenseKey: state.isValidLicenseKey,
      licenseKey: state.licenseKey,
      remains: state.remains,
      user: state.user,
      method: 'jwt',
      login,
      fakeLogin,
      register,
      logout,
      getLicenseKey,
      changeLicenseKey,
      checkLicenseKey
    }),
    [state.isAuthenticated, state.isInitialized, state.licenseKey, state.user, state.isValidLicenseKey, state.remains, login, fakeLogin, logout, register, getLicenseKey, changeLicenseKey, checkLicenseKey]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
