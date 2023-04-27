import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/RegisterPage')));
export const FlightCreatePage = Loadable(lazy(() => import('../pages/FlightCreatePage')));
export const FlightListPage = Loadable(lazy(() => import('../pages/FlightListPage')));
export const FlightDetailPage = Loadable(lazy(() => import('../pages/FlightDetailPage')));

export const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
