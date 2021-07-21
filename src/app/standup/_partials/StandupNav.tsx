import React from 'react';

import { Button, chakra, Flex, Link } from '@chakra-ui/react';
import { SiGooglehangoutsmeet } from 'react-icons/si';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { InternalBar } from '@/app/layout';
import { Routes } from '@/app/routes';
import { STANDUP_MEET_URL } from '@/app/standup/constants';
import { Icon } from '@/components';
import { formatExternalUrl } from '@/utils/link';

const NavItem = ({ to, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(to);
  return (
    <Flex
      as={RouterLink}
      to={to}
      position="relative"
      align="center"
      fontSize="sm"
      fontWeight="medium"
      px="3"
      color={isActive ? 'yellow.500' : undefined}
      transition="0.2s"
      _before={{
        content: '""',
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        transition: '0.2s',
        bg: isActive ? 'yellow.500' : undefined,
        h: '3px',
      }}
      {...rest}
    />
  );
};

export const StandupNav = ({ ...rest }) => {
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
      <Flex>
        <NavItem to={Routes.STANDUP_GOALS}>Objectifs</NavItem>
        <NavItem to={Routes.STANDUP_SPEAKING}>Stand-up</NavItem>
        <NavItem to={Routes.STANDUP_THANKS}>Remerciements</NavItem>
      </Flex>
    </InternalBar>
  );
};
