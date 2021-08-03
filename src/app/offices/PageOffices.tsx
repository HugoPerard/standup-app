import { Badge, Divider, HStack, Stack, Text } from '@chakra-ui/react';

import { Page, PageContent } from '@/app/layout';

import { useCurrentUser } from '../auth/useAuth';
import { OfficeSection } from './_partials/OfficeSection';
import { useAddPersonOnOffice, useOffices } from './offices.firebase';

export const PageOffices = () => {
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  const { data: offices } = useOffices();

  const currentUser = useCurrentUser();

  const { mutate: addPersonOnOffice } = useAddPersonOnOffice();

  const handleAddPresence = (
    day: string,
    officeId: string,
    params?: { onMorning: boolean; onAfternoon: boolean }
  ) => {
    const personToAdd = {
      name: currentUser?.username,
      onMorning: true,
      onAfternoon: true,
      ...(params || {}),
    };
    addPersonOnOffice({ person: personToAdd, day, officeId });
  };
  return (
    <Page containerSize="full">
      <PageContent>
        <Stack spacing={4}>
          {weekdays?.map((weekday) => (
            <Stack key={weekday}>
              <Text fontSize="lg" fontWeight="medium" color="yellow.500">
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
                      <Badge colorScheme="yellow" px={2}>
                        {office?.presence[weekday.toUpperCase()]?.length}
                      </Badge>
                    </HStack>
                    <Stack direction="row" flex={1}>
                      <OfficeSection
                        title="Journée"
                        presence={office?.presence[
                          weekday.toUpperCase()
                        ]?.filter(
                          (person) => person?.onMorning && person?.onAfternoon
                        )}
                        onClick={() =>
                          handleAddPresence(weekday.toUpperCase(), office.id)
                        }
                        flex={1}
                      />
                      <Divider orientation="vertical" />
                      <Stack flex={1}>
                        <OfficeSection
                          title="Matin"
                          presence={office?.presence[
                            weekday.toUpperCase()
                          ]?.filter(
                            (person) =>
                              person?.onMorning && !person?.onAfternoon
                          )}
                          onClick={() =>
                            handleAddPresence(
                              weekday.toUpperCase(),
                              office.id,
                              { onMorning: true, onAfternoon: false }
                            )
                          }
                          flex={1}
                        />
                        <Divider />
                        <OfficeSection
                          title="Après-midi"
                          presence={office?.presence[
                            weekday.toUpperCase()
                          ]?.filter(
                            (person) =>
                              !person?.onMorning && person?.onAfternoon
                          )}
                          onClick={() =>
                            handleAddPresence(
                              weekday.toUpperCase(),
                              office.id,
                              { onMorning: false, onAfternoon: true }
                            )
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
