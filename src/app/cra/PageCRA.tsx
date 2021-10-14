import React, { useEffect, useState } from 'react';

import {
  Box,
  Heading,
  Button,
  Input,
  Flex,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import { useQuery } from 'react-query';

import { Page, PageContent } from '@/app/layout';
import { Select } from '@/components/Select';

import { usePeoples } from './people.firebase';

export const PageCRA = () => {
  const [starDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [csvArray, setCsvArray] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    const start = dayjs().format('YYYY-MM-DD');
    setStartDate(start);
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    setEndDate(end);
  }, []);

  const handleChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;

    if (files) {
      Papa.parse(files[0], {
        complete: function (results) {
          setCsvArray(results.data);
        },
      });
    }
  };

  let arrayFilter = csvArray.filter((line) =>
    line.some((lineItem) => /[a-zA-Z]/.test(lineItem))
  );

  arrayFilter = arrayFilter.slice(1);
  const craEntries = [];

  arrayFilter.forEach((line) => {
    for (let i = 4; i <= 16; i += 3) {
      const craEntry = {
        email: line[1],
        date: line[2],
        remark: line[3],
        projectCode: line[i + 0],
        hour: line[i + 1],
        projectDetail: line[i + 2],
      };

      if (craEntry.projectCode.trim() !== '') {
        craEntries.push(craEntry);
      }
    }
  });

  const projectCodes = Array.from(
    new Set((craEntries || []).map((project) => project.projectCode))
  ).map((projectCode) => ({
    label: projectCode,
    value: projectCode,
  }));

  // const { data: people } = usePeoples();

  const { data: peoples } = useQuery<any>('new-people', () =>
    axios.get('https://localhost:8000/peoples')
  );

  const mailAddresses = (peoples || []).map((people: { email; status }) => ({
    label: people.email,
    value: people.email,
    status: people.status,
  }));

  const filterEmployees = () => {
    const employeesPeople = mailAddresses?.filter(
      (person) => person.status === 'salarié'
    );

    setSelectedPeople(employeesPeople);
  };

  const filterStudents = () => {
    const studentsPeople = mailAddresses?.filter(
      (person) => person.status === 'alternant'
    );

    setSelectedPeople(studentsPeople);
  };

  const filterTunisianPerson = () => {
    const camelStudioPeople = mailAddresses?.filter(
      (person) => person.status === 'tunisie'
    );

    setSelectedPeople(camelStudioPeople);
  };

  const filterExpensivePerson = () => {
    const expensivePeople = mailAddresses?.filter(
      (person) => person.status === 'couteux'
    );

    setSelectedPeople(expensivePeople);
  };
  const handleSelectUserChange = (newSelectedPeople) => {
    setSelectedPeople(newSelectedPeople);
  };
  const handleChangeProject = (newProjectCode) => {
    setSelectedProject(newProjectCode);
  };
  return (
    <Page containerSize="full" width="full">
      <PageContent>
        <Heading textAlign="center" mb="20px" color="yellow.500">
          CRA Dashboard
        </Heading>
        <Flex justifyContent="space-between">
          <Box color="gray.700" alignItems="center">
            <Button type="submit" bg="yellow.500" mr="10px">
              check week
            </Button>
            <Button type="submit" bg="yellow.500">
              check absent of the day
            </Button>
          </Box>

          <Box alignItems="center">
            <Text color="yellow.500">
              Mis à jour le : {dayjs().format('DD-MM-YYYY')}
            </Text>

            <Input
              type="file"
              bg="gray.800"
              border="opx"
              textColor="gray.800"
              color="yellow.500"
              // accept=".csv"
              id="csvFile"
              pt="4px"
              onChange={handleFileUpload}
            />
          </Box>
        </Flex>

        <Flex justifyContent="space-around" mt="20px">
          <Flex direction="column" flex="1" mr="20px">
            <Select
              isMulti
              color="gray.700"
              placeholder="Email"
              value={selectedPeople}
              options={mailAddresses}
              onChange={handleSelectUserChange}
              width="26rem"
            />

            <Flex color="gray.700">
              <Button
                marginRight="2.5"
                color="yellow.500"
                onClick={filterTunisianPerson}
                variant="link"
              >
                Tunisie
              </Button>
              <Button
                variant="link"
                marginRight="2.5"
                color="yellow.500"
                onClick={filterExpensivePerson}
              >
                couteux
              </Button>
              <Button
                variant="link"
                marginRight="2.5"
                color="yellow.500"
                onClick={filterStudents}
              >
                alternants
              </Button>
              <Button
                variant="link"
                marginRight="2.5"
                color="yellow.500"
                onClick={filterEmployees}
              >
                Salariés
              </Button>
            </Flex>
          </Flex>
          <Select
            mr="8rem"
            placeholder="selectionner un projet"
            color="black"
            onChange={handleChangeProject}
            value={selectedProject}
            options={projectCodes}
            width="30rem"
          />
          <Input
            width="auto"
            mr="3"
            type="date"
            color="black"
            textAlign="center"
            value={starDate}
            onChange={handleChange}
          />
          <Input
            width="auto"
            type="date"
            color="black"
            textAlign="center"
            value={endDate}
          />
        </Flex>

        <Box width="100%" h="full" border="2px" mt="6" borderColor="yellow.500">
          {arrayFilter.length > 0 ? (
            <>
              <Table color="yellow.500">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Adress Email</Th>
                    <Th textAlign="center">Date</Th>
                    <Th textAlign="center">Remarque</Th>
                    <Th textAlign="center">Nom du projet</Th>
                    <Th textAlign="center">Temps en heure</Th>
                    <Th textAlign="center">Taches</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {craEntries
                    .filter(
                      (entry) => selectedProject?.value === entry.projectCode
                    )
                    .map((entry, i) => (
                      <Tr key={i}>
                        <Td textAlign="center">{entry.email}</Td>
                        <Td textAlign="center">
                          {dayjs(entry.date).format('DD/MM/YYYY')}
                        </Td>
                        <Td textAlign="center">{entry.remark}</Td>
                        <Td textAlign="center">{entry.projectCode}</Td>
                        <Td textAlign="center">{entry.hour}</Td>
                        <Td textAlign="center">{entry.projectDetail}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </>
          ) : null}
        </Box>
      </PageContent>
    </Page>
  );
};
