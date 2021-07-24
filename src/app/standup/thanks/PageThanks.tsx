import React from 'react';

import { Stack } from '@chakra-ui/layout';
import { Button, ButtonGroup, SimpleGrid } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { FiRefreshCcw, FiTrash2 } from 'react-icons/fi';

import { Loader, Page, PageContent } from '@/app/layout';
import { ThankGroup } from '@/app/standup/thanks/_partials/ThankGroup';
import { Icon } from '@/components';

import { useThanks, useThanksDelete } from './thanks.firebase';

export const PageThanks = () => {
  const {
    data: thanks,
    isLoading: isLoadingThanks,
    isFetching: isFetchingThanks,
    refetch: refetchThanks,
  } = useThanks({ refetchInterval: 2000 });
  const sortedThanks = thanks?.sort((a, b) => {
    if (dayjs(a?.date)?.isBefore(dayjs(b?.date))) {
      return -1;
    }
    if (dayjs(a?.date)?.isAfter(dayjs(b?.date))) {
      return 1;
    }
    return 0;
  });

  const {
    mutate: clearAllThanks,
    isLoading: isLoadingClearAllThanks,
  } = useThanksDelete();

  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        {isLoadingThanks ? (
          <Loader />
        ) : (
          <Stack spacing={4}>
            <Stack direction={{ base: 'column', sm: 'row' }}>
              <ButtonGroup size="sm">
                <Button
                  variant="@primary"
                  onClick={() => refetchThanks()}
                  flex="1"
                  px={4}
                  isLoading={isFetchingThanks}
                >
                  <Icon icon={FiRefreshCcw} mr={2} />
                  Refresh
                </Button>
                <Button
                  variant="@primary"
                  onClick={() => clearAllThanks()}
                  flex="1"
                  isLoading={isLoadingClearAllThanks}
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
