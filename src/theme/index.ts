import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

import * as components from './components';
import foundations from './foundations';
import { styles } from './styles';

export default extendTheme(
  withDefaultColorScheme({
    colorScheme: 'brand',
    components: ['Button', 'Checkbox'],
  }),
  {
    styles,
    ...foundations,
    components: { ...(components as any) },
  }
);
