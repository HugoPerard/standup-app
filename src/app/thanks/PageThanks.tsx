import React from 'react';
import { useState } from 'react';

import { Stack } from '@chakra-ui/layout';
import {
  Button,
  ButtonGroup,
  Input,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { Loader, Page, PageContent } from '@/app/layout';
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

  const handleSaveName = () => {
    window.localStorage.setItem('Thank_author', authorName);
  };

  const [authorName, setAuthorName] = useState(
    window.localStorage.getItem('Thank_author')
  );

  return (
    <Page containerSize="full" bg="gray.800">
      <PageContent color="gray.200">
        {isLoading ? (
          <Loader />
        ) : (
          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              alignItems={{ sm: 'flex-end' }}
            >
              <Stack flex="2">
                <Text fontSize="sm">C'est qui lô</Text>
                <Input
                  color="gray.800"
                  value={authorName || ''}
                  onChange={(e) => setAuthorName(e?.target?.value)}
                />
              </Stack>
              <Button
                variant="@primary"
                onClick={() => handleSaveName()}
                flex="1"
                minH={8}
              >
                Sauvegarder
              </Button>
              <Spacer flex="2" />
              <ButtonGroup>
                <Button
                  variant="@primary"
                  onClick={() => refetchThanks()}
                  flex="1"
                  minH={8}
                  isDisabled={isLoadingClearAllThanks}
                >
                  Refresh
                </Button>
                <Button
                  variant="@primary"
                  onClick={() => clearAllThanks()}
                  flex="1"
                  minH={8}
                  isDisabled={isLoadingClearAllThanks}
                >
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
                author={authorName}
              />
              <ThankGroup
                name="Remerciements"
                thanks={sortedThanks?.filter(
                  (thank) => thank?.type === 'THANK'
                )}
                type="THANK"
                author={authorName}
              />
            </SimpleGrid>
          </Stack>
        )}
      </PageContent>
    </Page>
  );
};
