// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );

const icon = (name) => <Iconify icon={name} width={24} />;

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  flight: icon('mdi:airplane'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general v4.1.0',
  //   items: [
  //     { title: 'One', path: PATH_DASHBOARD.one, icon: ICONS.dashboard },
  //     { title: 'Two', path: PATH_DASHBOARD.two, icon: ICONS.ecommerce },
  //     { title: 'Three', path: PATH_DASHBOARD.three, icon: ICONS.analytics },
  //   ],
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'General',
    items: [
      {
        title: 'Flight',
        path: PATH_DASHBOARD.flight.root,
        icon: ICONS.flight,
        children: [
          { title: 'Dashboard', path: PATH_DASHBOARD.flight.list },
          // { title: 'Active Flight', path: PATH_DASHBOARD.flight.list },
          // { title: 'Finished Flight', path: PATH_DASHBOARD.flight.list },
          // { title: 'All Flights', path: PATH_DASHBOARD.flight.list },
          // { title: 'Total Profit', path: PATH_DASHBOARD.flight.list },
          // { title: 'Create', path: PATH_DASHBOARD.flight.create },
          // { title: 'Six', path: PATH_DASHBOARD.user.six },
        ],
      },
    ],
  },
];

export default navConfig;
