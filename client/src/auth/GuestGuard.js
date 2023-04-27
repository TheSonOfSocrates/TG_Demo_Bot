import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  console.log('isAuthenticated', isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
