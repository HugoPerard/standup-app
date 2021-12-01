import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  Wrap,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import { useCurrentUser } from '@/app/auth/useAuth';
import { Loader, Page, PageContent } from '@/app/layout';
import { FormModal, Icon, PersonTag } from '@/components';
import { useDarkMode } from '@/hooks/useDarkMode';

import { OfficeForm } from './_partials/OfficeForm';
import { OfficeSection } from './_partials/OfficeSection';
import {
  useAddPersonOnOffice,
  useOfficeAdd,
  useOfficeDelete,
  useOffices,
  useRemovePersonOnOffice,
} from './offices.firebase';
import { Office, OfficeWorker } from './offices.types';

export const PageOffices = () => {
  const { colorModeValue } = useDarkMode();
  const currentUser = useCurrentUser();

  const weekdays = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  const {
    isOpen: isOpenAddOfficeModal,
    onOpen: onOpenAddOfficeModal,
    onClose: onCloseAddOfficeModal,
  } = useDisclosure();

  const { mutate: addOffice } = useOfficeAdd();
  const {
    mutate: deleteOffice,
    isLoading: isLoadingDeleteOffice,
  } = useOfficeDelete();

  const { data: offices, isLoading: isLoadingOffices } = useOffices();

  const { mutate: addPersonOnOffice } = useAddPersonOnOffice();
  const { mutate: removePersonOnOffice } = useRemovePersonOnOffice();

  const handleChangePresence = (
    office: Office,
    day: string,
    params: { onMorning: boolean; onAfternoon: boolean } = {
      onMorning: true,
      onAfternoon: true,
    }
  ) => {
    const person = {
      photoUrl: currentUser?.photoURL,
      name: currentUser?.username,
      ...(params || {}),
    };
    if (
      office?.presence?.[day]?.find(
        (officeWorker: OfficeWorker) =>
          officeWorker?.name === currentUser.username &&
          params &&
          officeWorker?.onMorning === params?.onMorning &&
          officeWorker?.onAfternoon === params?.onAfternoon &&
          officeWorker?.photoUrl === currentUser.photoURL
      )
    ) {
      removePersonOnOffice({ person, day, officeId: office?.id });
      return;
    }

    addPersonOnOffice({ person, day, officeId: office?.id });
  };

  return (
    <Page containerSize="full">
      <PageContent>
        {isLoadingOffices && <Loader />}
        {!isLoadingOffices && offices?.length === 0 && (
          <Center flex="1">
            <Stack spacing={4}>
              <Text fontWeight="medium">Aucun bureau n'est créé</Text>
              <Button
                variant="@primary"
                size="sm"
                onClick={onOpenAddOfficeModal}
              >
                <Icon icon={FiPlus} mr={1} /> Ajouter un bureau
              </Button>
            </Stack>
          </Center>
        )}

        {!isLoadingOffices && offices?.length !== 0 && (
          <Stack spacing={4}>
            <Wrap>
              <Text fontWeight="medium">Liste des bureaux :</Text>
              {offices?.map((office) => (
                <PersonTag
                  size="sm"
                  onRemove={() => deleteOffice(office?.id)}
                  isLoadingRemove={isLoadingDeleteOffice}
                >
                  {office.name}
                </PersonTag>
              ))}
              <Box minW="10rem">
                <Button variant="link" size="xs" onClick={onOpenAddOfficeModal}>
                  <Icon icon={FiPlus} mr={1} /> Ajouter un bureau
                </Button>
              </Box>
            </Wrap>
            <Stack spacing={6}>
              {weekdays?.map((weekday) => (
                <Stack key={weekday}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="brand.500"
                    alignSelf="center"
                  >
                    {weekday}
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
                    {offices?.map((office) => (
                      <Stack
                        key={office?.id}
                        bg={colorModeValue('gray.300', 'gray.700')}
                        p={3}
                        borderRadius="md"
                        flex="1"
                      >
                        <HStack spacing={2}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            wordBreak="break-word"
                          >
                            {office?.name}
                          </Text>
                          <Badge variant="solid" px={2}>
                            {office?.presence?.[weekday]?.length}
                          </Badge>
                        </HStack>
                        <Stack direction="row" flex={1}>
                          <OfficeSection
                            title="Journée"
                            presence={office?.presence?.[weekday]?.filter(
                              (person) =>
                                person?.onMorning && person?.onAfternoon
                            )}
                            onClick={() =>
                              handleChangePresence(office, weekday)
                            }
                            flex={1}
                          />
                          <Divider orientation="vertical" />
                          <Stack flex={1}>
                            <OfficeSection
                              title="Matin"
                              presence={office?.presence?.[weekday]?.filter(
                                (person) =>
                                  person?.onMorning && !person?.onAfternoon
                              )}
                              onClick={() =>
                                handleChangePresence(office, weekday, {
                                  onMorning: true,
                                  onAfternoon: false,
                                })
                              }
                              flex={1}
                            />
                            <Divider />
                            <OfficeSection
                              title="Après-midi"
                              presence={office?.presence?.[weekday]?.filter(
                                (person) =>
                                  !person?.onMorning && person?.onAfternoon
                              )}
                              onClick={() =>
                                handleChangePresence(office, weekday, {
                                  onMorning: false,
                                  onAfternoon: true,
                                })
                              }
                              flex={1}
                            />
                          </Stack>
                        </Stack>
                      </Stack>
                    ))}
                  </SimpleGrid>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </PageContent>
      <FormModal
        isOpen={isOpenAddOfficeModal}
        onClose={onCloseAddOfficeModal}
        onSubmit={addOffice}
      >
        <OfficeForm />
      </FormModal>
    </Page>
  );
};
