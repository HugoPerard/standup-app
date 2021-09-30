import React from 'react';

import { Stack } from '@chakra-ui/layout';
import {
  Button,
  Flex,
  Spacer,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';

import { Loader, Page, PageContent } from '@/app/layout';
import { ThankGroup } from '@/app/standup/thanks/_partials/ThankGroup';
import { Icon } from '@/components';

import { useThanks, useThanksDelete } from './thanks.firebase';

export const PageThanks = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: thanks, isLoading: isLoadingThanks } = useThanks({
    refetchInterval: 2000,
  });
  const sortedThanks = [...(thanks || [])]?.sort((a, b) => {
    return a?.timestamp - b?.timestamp;
  });

  const {
    mutate: clearAllThanks,
    isLoading: isLoadingClearAllThanks,
  } = useThanksDelete();

  const handleClearAllThanks = () => {
    clearAllThanks();
    onClose();
  };

  return (
    <Page containerSize="full">
      <PageContent>
        {isLoadingThanks ? (
          <Loader />
        ) : (
          <Stack spacing={4}>
            <Flex>
              <Spacer />

              <Popover isOpen={isOpen}>
                <PopoverTrigger>
                  <Button variant="@primary" onClick={onOpen} size="sm">
                    <Icon icon={FiTrash2} mr={2} />
                    Tout supprimer
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton onClick={onClose} />
                  <PopoverBody>
                    Êtes vous sûr de vouloir tout supprimer ?
                  </PopoverBody>
                  <PopoverFooter>
                    <Button
                      onClick={handleClearAllThanks}
                      isLoading={isLoadingClearAllThanks}
                      variant="@danger"
                    >
                      Supprimer
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </Flex>
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
