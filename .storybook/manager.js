// .storybook/manager.js
import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

import logo from './logo.svg';

const theme = create({
  base: 'light',
  brandTitle: 'StandUp',
  brandImage: logo,
});

addons.setConfig({
  theme,
});
