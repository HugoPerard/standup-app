import { useState } from 'react';

import {
  Box,
  Stack,
  Text,
  Code,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { DayPicker } from './index';

export default {
  title: 'Components/DayPicker',
  decorators: [
    (Story) => (
      <Box h="25rem">
        <Story />
      </Box>
    ),
  ],
};

export const Default = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <Stack spacing={2}>
      <Text>Date : {selectedDay?.toISOString()}</Text>
      <DayPicker value={selectedDay} onChange={setSelectedDay} />
    </Stack>
  );
};

export const WithDisabledDays = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <Stack spacing={2}>
      <Text>Date : {selectedDay?.toISOString()}</Text>
      <DayPicker
        value={selectedDay}
        onChange={setSelectedDay}
        dayPickerProps={{
          disabledDays: [{ daysOfWeek: [4] }],
        }}
      />
    </Stack>
  );
};

export const WithPastDaysDisabled = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <Stack spacing={2}>
      <Text>Date : {selectedDay?.toISOString()}</Text>
      <DayPicker
        value={selectedDay}
        onChange={setSelectedDay}
        arePastDaysDisabled
        dayPickerProps={{
          disabledDays: [{ daysOfWeek: [4] }],
        }}
      />
    </Stack>
  );
};

export const QuickInputs = () => {
  const [selectedDay, setSelectedDay] = useState<Date>(undefined);

  return (
    <Stack spacing={2}>
      <Box>
        <Text fontSize="lg">
          User can input dates using input shortcuts then tabbing:
        </Text>
        <Table my={4}>
          <Thead>
            <Tr>
              <Th>Format</Th>
              <Th>User input</Th>
              <Th>Result</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Code>DD/MM/YYYY</Code>
              </Td>
              <Td>01/01/2021</Td>
              <Td>01/01/2021</Td>
            </Tr>

            <Tr>
              <Td>
                <Code>DD</Code>
              </Td>
              <Td>22</Td>
              <Td>22/06/2021 (current month and year)</Td>
            </Tr>

            <Tr>
              <Td>
                <Code>DDMM</Code>
              </Td>
              <Td>2208</Td>
              <Td>22/08/2021 (current year)</Td>
            </Tr>

            <Tr>
              <Td>
                <Code>DDMMYY</Code>
              </Td>
              <Td>220845</Td>
              <Td>22/08/2045</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Text>Date : {selectedDay?.toISOString()}</Text>
      <DayPicker value={selectedDay} onChange={setSelectedDay} />
    </Stack>
  );
};
