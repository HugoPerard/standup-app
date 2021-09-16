import React from 'react';

import { Button, chakra, Flex, Link, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { SiGooglehangoutsmeet } from 'react-icons/si';

import { InternalBar, InternalBarItem } from '@/app/layout';
import { Routes } from '@/app/routes';
import { STANDUP_MEET_URL } from '@/app/standup/constants';
import { Icon } from '@/components';
import { formatExternalUrl } from '@/utils/link';

export const StandupNav = ({ ...rest }) => {
  const start = dayjs().format('LL');

  return (
    <InternalBar {...rest}>
      <Link
        href={formatExternalUrl(STANDUP_MEET_URL)}
        isExternal
        alignSelf="center"
      >
        <Button variant="@primary" size="sm">
          <Icon icon={SiGooglehangoutsmeet} />
          <chakra.span ml={1} fontWeight="medium">
            Meet
          </chakra.span>
        </Button>
      </Link>
      <Flex width="full">
        <InternalBarItem to={Routes.STANDUP_GOALS}>Objectifs</InternalBarItem>
        <InternalBarItem to={Routes.STANDUP_SPEAKING}>Stand-up</InternalBarItem>
        <InternalBarItem to={Routes.STANDUP_THANKS}>
          Remerciements
        </InternalBarItem>
        <Text
          color="yellow.500"
          alignSelf="center"
          ml="auto"
          fontWeight="bold"
          fontSize="1.2em"
        >
          {start}
        </Text>
      </Flex>

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
    </InternalBar>
  );
};
