import React, { useEffect, useState } from 'react';

import {
  Box,
  Heading,
  Button,
  Input,
  Flex,
  Select,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Papa from 'papaparse';

import { Page, PageContent } from '@/app/layout';

export const PageCRA = () => {
  const [starDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cvsArray, setCvsArray] = useState([]);
  const [isProject, setIsProject] = useState();

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
          setCvsArray(results.data);
        },
      });
    }
  };
  const handleChangeProject = (projectCode) => {
    setIsProject(projectCode);
    console.log(projectCode);
  };

  let arrayFilter = cvsArray.filter((line) =>
    line.some((lineItem) => /[a-zA-Z]/.test(lineItem))
  );
  arrayFilter = arrayFilter.slice(1);
  const craEntries = [];
  console.log(craEntries);

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
    //   const craEntry1 = {
    //     email: line[1],
    //     date: line[2],
    //     remark: line[3],
    //     projectCode: line[4],
    //     hour: line[5],
    //     projectDetail: line[6],
    //   };

    //   if (craEntry1.projectCode.trim() !== '') {
    //     craEntries.push(craEntry1);
    //   }

    //   const craEntry2 = {
    //     email: line[1],
    //     date: line[2],
    //     remark: line[3],
    //     projectCode: line[7],
    //     hour: line[8],
    //     projectDetail: line[9],
    //   };
    //   if (craEntry2.projectCode.trim() !== '') {
    //     craEntries.push(craEntry2);
    //   }

    //   const craEntry3 = {
    //     email: line[1],
    //     date: line[2],
    //     remark: line[3],
    //     projectCode: line[10],
    //     hour: line[11],
    //     projectDetail: line[12],
    //   };
    //   if (craEntry3.projectCode.trim() !== '') {
    //     craEntries.push(craEntry3);
    //   }
    //   const craEntry4 = {
    //     email: line[1],
    //     date: line[2],
    //     remark: line[3],
    //     projectCode: line[13],
    //     hour: line[14],
    //     projectDetail: line[15],
    //   };
    //   if (craEntry4.projectCode.trim() !== '') {
    //     craEntries.push(craEntry4);
    //   }
    //   const craEntry5 = {
    //     email: line[1],
    //     date: line[2],
    //     remark: line[3],
    //     projectCode: line[16],
    //     hour: line[17],
    //     projectDetail: line[18],
    //   };
    //   if (craEntry5.projectCode.trim() !== '') {
    //     craEntries.push(craEntry5);
    //   }
  });

  const projectCodes = Array.from(
    new Set(craEntries.map((project) => project.projectCode))
  );

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
              check Assholes
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
            <Select color="gray.700" placeholder="Email" width="full"></Select>
            <Flex color="gray.700">
              <Link marginRight="10px" color="yellow.500">
                Tunisie
              </Link>
              <Link marginRight="10px" color="yellow.500">
                Peons
              </Link>
              <Link marginRight="10px" color="yellow.500">
                Maroc
              </Link>
              <Link marginRight="10px" color="yellow.500">
                France
              </Link>
            </Flex>
          </Flex>
          <Select
            color="gray.700"
            flex="1"
            mr="20px"
            placeholder="selectionner un projet"
            onChange={(event) => handleChangeProject(event.target.value)}
          >
            {projectCodes.map((projectCode) => (
              <option value={projectCode} key={projectCode}>
                {projectCode}
              </option>
            ))}
          </Select>

          <Input
            width="auto"
            mr="20px"
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

        <Box
          width="100%"
          h="full"
          border="4px"
          mt="20px"
          borderColor="yellow.500"
        >
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
                    .filter((entry) => isProject === entry.projectCode)
                    .map((entry, i) => (
                      <Tr key={i}>
                        <Td>{entry.email}</Td>
                        <Td>{entry.date}</Td>
                        <Td>{entry.remark}</Td>
                        <Td>{entry.projectCode}</Td>
                        <Td>{entry.hour}</Td>
                        <Td>{entry.projectDetail}</Td>
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
