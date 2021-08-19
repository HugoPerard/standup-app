import React from 'react';

import { Stack } from '@chakra-ui/layout';
import { Button, ButtonGroup, Textarea } from '@chakra-ui/react';
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
    if (dayjs(a?.timestamp)?.isBefore(dayjs(b?.timestamp))) {
      return -1;
    }
    if (dayjs(a?.timestamp)?.isAfter(dayjs(b?.timestamp))) {
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
                  px={4}
                  isLoading={isFetchingThanks}
                >
                  <Icon icon={FiRefreshCcw} mr={2} />
                  Rafraichir
                </Button>
                <Button
                  variant="@primary"
                  onClick={() => clearAllThanks()}
                  flex={1}
                  isLoading={isLoadingClearAllThanks}
                >
                  <Icon icon={FiTrash2} mr={2} />
                  Tout supprimer
                </Button>
              </ButtonGroup>
            </Stack>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={2}
              flex={1}
            >
              <Textarea
                placeholder="Notes..."
                defaultValue={localStorage.getItem('thanks-notes')}
                onChange={(e) =>
                  localStorage.setItem('thanks-notes', e.target.value)
                }
                bg="gray.600"
                color="gray.100"
                borderColor="gray.800"
                flex={1}
              />
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                spacing={2}
                flex={2}
              >
                <ThankGroup
                  name="Choses à ajouter"
                  thanks={sortedThanks?.filter(
                    (thank) => thank?.type === 'TO_ADD'
                  )}
                  type="TO_ADD"
                  flex={2}
                />
                <ThankGroup
                  name="Remerciements"
                  thanks={sortedThanks?.filter(
                    (thank) => thank?.type === 'THANK'
                  )}
                  type="THANK"
                  flex={2}
                />
              </Stack>
            </Stack>
          </Stack>
        )}
      </PageContent>
    </Page>
  );
};
