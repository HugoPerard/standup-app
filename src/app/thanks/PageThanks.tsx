import React from 'react';

import { Stack } from '@chakra-ui/layout';
import { Button, ButtonGroup, SimpleGrid } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FiRefreshCcw, FiTrash2 } from 'react-icons/fi';

import { Loader, Page, PageContent } from '@/app/layout';
import { Icon } from '@/components';
import { ThankGroup } from '@/components/ThankGroup';

import { DATE_COMPLETE_FORMAT } from '../shared/constants';
import { useThanks, useThanksDelete } from './thanks.firebase';

export const PageThanks = () => {
  const {
    data: thanks,
    isLoading: isLoadingThanks,
    refetch: refetchThanks,
  } = useThanks();
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

  const {
    mutate: clearAllThanks,
    isLoading: isLoadingClearAllThanks,
  } = useThanksDelete();

  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        {isLoading ? (
          <Loader />
        ) : (
          <Stack spacing={6}>
            <Stack direction={{ base: 'column', sm: 'row' }}>
              <ButtonGroup>
                <Button
                  variant="@primary"
                  onClick={() => refetchThanks()}
                  flex="1"
                  p={5}
                  isDisabled={isLoadingClearAllThanks}
                >
                  <Icon icon={FiRefreshCcw} mr={2} />
                  Refresh
                </Button>
                <Button
                  variant="@primary"
                  onClick={() => clearAllThanks()}
                  flex="1"
                  isDisabled={isLoadingClearAllThanks}
                >
                  <Icon icon={FiTrash2} mr={2} />
                  Clear
                </Button>
              </ButtonGroup>
            </Stack>
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
