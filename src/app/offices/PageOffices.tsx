import { Stack, Text } from '@chakra-ui/react';

import { Page, PageContent } from '@/app/layout';

import { useOffices } from './offices.firebase';

export const PageOffices = () => {
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  const { data: offices } = useOffices();
  return (
    <Page containerSize="full">
      <PageContent>
        <Stack spacing={4}>
          {weekdays?.map((weekday) => (
            <Stack key={weekday}>
              <Text fontWeight="bold">{weekday}</Text>
              <Stack direction="row">
                {offices?.map((office) => (
                  <Stack
                    key={office.id}
                    bg="gray.600"
                    p={4}
                    borderRadius="md"
                    flex="1"
                  >
                    <Text fontWeight="medium">{office?.name}</Text>
                    {office?.people?.map((person) => (
                      <Text>{person}</Text>
                    ))}
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
