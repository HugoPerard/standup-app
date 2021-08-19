import { Badge, Divider, HStack, Stack, Text } from '@chakra-ui/react';

import { Page, PageContent } from '@/app/layout';

import { useCurrentUser } from '../auth/useAuth';
import { OfficeSection } from './_partials/OfficeSection';
import {
  useAddPersonOnOffice,
  useOffices,
  useRemovePersonOnOffice,
} from './offices.firebase';
import { Office, OfficeWorker } from './offices.types';

export const PageOffices = () => {
  const weekdays = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];

  const { data: offices } = useOffices();

  const currentUser = useCurrentUser();

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
      name: currentUser?.username,
      ...(params || {}),
    };
    if (
      office?.presence[day]?.find(
        (officeWorker: OfficeWorker) =>
          officeWorker?.name === currentUser.username &&
          params &&
          officeWorker?.onMorning === params?.onMorning &&
          officeWorker?.onAfternoon === params?.onAfternoon
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
        <Stack spacing={6}>
          {weekdays?.map((weekday) => (
            <Stack key={weekday}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="yellow.500"
                alignSelf="center"
              >
                {weekday}
              </Text>
              <Stack direction={{ base: 'column', md: 'row' }}>
                {offices?.map((office) => (
                  <Stack
                    key={office?.id}
                    bg="gray.700"
                    p={3}
                    borderRadius="md"
                    flex="1"
                  >
                    <HStack spacing={2}>
                      <Text fontSize="lg" fontWeight="bold">
                        {office?.name}
                      </Text>
                      <Badge variant="solid" px={2}>
                        {office?.presence[weekday]?.length}
                      </Badge>
                    </HStack>
                    <Stack direction="row" flex={1}>
                      <OfficeSection
                        title="Journée"
                        presence={office?.presence[weekday]?.filter(
                          (person) => person?.onMorning && person?.onAfternoon
                        )}
                        onClick={() => handleChangePresence(office, weekday)}
                        flex={1}
                      />
                      <Divider orientation="vertical" />
                      <Stack flex={1}>
                        <OfficeSection
                          title="Matin"
                          presence={office?.presence[weekday]?.filter(
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
                          presence={office?.presence[weekday]?.filter(
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
              </Stack>
            </Stack>
          ))}
        </Stack>
      </PageContent>
    </Page>
  );
};
