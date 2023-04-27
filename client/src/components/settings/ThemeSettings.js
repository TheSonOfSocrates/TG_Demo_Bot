import PropTypes from 'prop-types';
import ThemeColorPresets from './ThemeColorPresets';
import SettingsDrawer from './drawer';

// ----------------------------------------------------------------------

ThemeSettings.propTypes = {
  children: PropTypes.node,
};

export default function ThemeSettings({ children }) {
  return (
    <ThemeColorPresets>
      {children}
      <SettingsDrawer />
    </ThemeColorPresets>
  );
}
