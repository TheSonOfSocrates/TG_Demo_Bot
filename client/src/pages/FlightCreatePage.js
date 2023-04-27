import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '../routes/paths';
// components
import { useSettingsContext } from '../components/settings';
import FlightNewForm from './FlightComponents/FlightNewForm';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function PageFive() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Flight Create </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new flight"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Flight',
              href: PATH_DASHBOARD.flight.list,
            },
            { name: 'New Flight' },
          ]}
        />
        <FlightNewForm />
      </Container>
    </>
  );
}
