import { mode } from '@chakra-ui/theme-tools';

export default {
  variants: {
    outline: (props) => ({
      field: {
        bg: mode('gray.100', 'gray.700')(props),
      },
    }),
  },
};
