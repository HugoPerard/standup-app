import { GlobalStyleProps, mode } from '@chakra-ui/theme-tools';

import * as externals from './externals';

const externalsStyles = (props: GlobalStyleProps) =>
  Object.values(externals).reduce(
    (acc, cur) => ({ ...acc, ...cur(props) }),
    {}
  );

export const styles = {
  global: (props) => ({
    html: {
      bg: mode('gray.50', 'gray.800')(props),
    },
    body: {
      bg: mode('gray.50', 'gray.800')(props),
      WebkitTapHighlightColor: 'transparent',
    },
    '#chakra-toast-portal > *': {
      pt: 'safe-top',
      pl: 'safe-left',
      pr: 'safe-right',
      pb: 'safe-bottom',
    },
    ...externalsStyles(props),
  }),
};
