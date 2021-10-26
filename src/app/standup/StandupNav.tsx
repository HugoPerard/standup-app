import React from 'react';

import {
  Button,
  Flex,
  Link,
  Text,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { SiGooglehangoutsmeet } from 'react-icons/si';

import { InternalBar, InternalBarItem } from '@/app/layout';
import { Routes } from '@/app/routes';
import { STANDUP_MEET_URL } from '@/app/standup/standup/constants';
import { Icon } from '@/components';
import { formatExternalUrl } from '@/utils/link';

export const StandupNav = ({ ...rest }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const start = dayjs().format(isMobile ? 'DD/MM/YYYY' : 'dddd LL');

  return (
    <InternalBar {...rest}>
      <Flex flex="1">
        <InternalBarItem to={Routes.STANDUP_GOALS}>Objectifs</InternalBarItem>
        <InternalBarItem to={Routes.STANDUP_STANDUP}>Stand-up</InternalBarItem>
        <InternalBarItem to={Routes.STANDUP_THANKS}>
          Remerciements
        </InternalBarItem>
      </Flex>

      <Stack direction="row" spacing={3} alignItems="center">
        <Text fontWeight="medium" casing="capitalize">
          {start}
        </Text>
        <Link
          href={formatExternalUrl(STANDUP_MEET_URL)}
          isExternal
          alignSelf="center"
        >
          <Button variant="@primary" size="xs" fontWeight="bold">
            <Icon icon={SiGooglehangoutsmeet} mr={1} />
            Meet
          </Button>
        </Link>
      </Stack>
    </InternalBar>
  );
};
