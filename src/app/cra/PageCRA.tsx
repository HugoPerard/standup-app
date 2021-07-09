import React from 'react';

import { Heading } from '@chakra-ui/react';
import Image from 'next/image';

import { Page, PageContent } from '@/app/layout';

export const PageCRA = () => {
  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        <Heading>Soon...</Heading>
        <Image
          src="/CRA-soon.jpg"
          alt="CRA-Soon"
          layout="fill"
          objectFit="contain"
        />
      </PageContent>
    </Page>
  );
};
