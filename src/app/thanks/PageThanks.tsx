import React from 'react';

import { Stack } from '@chakra-ui/layout';
import { Button, SimpleGrid } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { Loader, Page, PageContent } from '@/app/layout';
import { ThankGroup } from '@/components/ThankGroup';

import { DATE_COMPLETE_FORMAT } from '../shared/constants';
import { useThanks, useThanksDelete } from './thanks.firebase';

export const PageThanks = () => {
  const { data: thanks, isLoading: isLoadingThanks } = useThanks();
  const sortedThanks = thanks?.sort((a, b) => {
    if (
      dayjs(a?.date, DATE_COMPLETE_FORMAT)?.isBefore(
        dayjs(b?.date, DATE_COMPLETE_FORMAT)
      )
    ) {
      return -1;
    }
    if (
      dayjs(a?.date, DATE_COMPLETE_FORMAT)?.isAfter(
        dayjs(b?.date, DATE_COMPLETE_FORMAT)
      )
    ) {
      return 1;
    }
    return 0;
  });

  const isLoading = isLoadingThanks;

  const { mutate: clearAllThanks } = useThanksDelete();

  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        {isLoading ? (
          <Loader />
        ) : (
          <Stack spacing={6}>
            <Button variant="@primary" onClick={() => clearAllThanks()}>
              Clear
            </Button>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="2">
              <ThankGroup
                name="Choses à ajouter"
                thanks={sortedThanks?.filter(
                  (thank) => thank?.type === 'TO_ADD'
                )}
                type="TO_ADD"
              />
              <ThankGroup
                name="Remerciements"
                thanks={sortedThanks?.filter(
                  (thank) => thank?.type === 'THANK'
                )}
                type="THANK"
              />
            </SimpleGrid>
          </Stack>
        )}
      </PageContent>
    </Page>
  );
};
