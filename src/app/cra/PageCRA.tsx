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

  const arrayFilter = cvsArray.filter((line) =>
    line.some((lineItem) => /[a-zA-Z]/.test(lineItem))
  );

  // let myObj = Object.assign({}, arrayFilter);
  // console.log(myObj);
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
            {/* <Text color="yellow.500">
              Mis à jour le : {dayjs().format('DD-MM-YYYY')}
            </Text> */}

            <Input
              type="file"
              bg="gray.800"
              border="opx"
              textColor="gray.800"
              color="yellow.500"
              accept=".csv"
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
            placeholder="projet"
          ></Select>

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
                  {arrayFilter.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item[1]}</Td>
                      <Td>{item[2]}</Td>
                      <Td>{item[3]}</Td>
                      <Td>{item[4]}</Td>
                      <Td>{item[5]}</Td>
                      <Td>{item[6]}</Td>
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
