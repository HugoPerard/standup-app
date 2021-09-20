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
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import { CSVReader } from 'react-papaparse';

import { Page, PageContent } from '@/app/layout';

export const PageCRA = () => {
  const [starDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cvsArray, setCvsArray] = useState([]);
  const [csvFile, setCsvFile] = useState();

  useEffect(() => {
    const start = dayjs().format('YYYY-MM-DD');
    setStartDate(start);
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    setEndDate(end);
  }, []);

  const handleChange = (e) => {
    setStartDate(e.target.value);
  };
  // const submit = () => {
  //   const file = csvFile;
  //   const reader = new FileReader();

  //   reader.onload = function (e) {
  //     const text = e.target.result;
  //     console.log(text);
  //   };

  //   reader.readAsText(file);
  // };

  const handleFileUpload = (e) => {
    const files = e.target.files;

    if (files) {
      Papa.parse(files[0], {
        complete: function (results) {
          console.log(results.data);
          setCvsArray(results.data);
          // submit();
        },
      });
    }
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
              check Assholes
            </Button>
          </Box>
          <Box alignItems="center">
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
            ></Input>
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
          <Table
            onLoad={(e) => {
              e.preventDefault();
            }}
          >
            <Thead>
              <Tr>
                <Th>Adress Email</Th>
                <Th>Date</Th>
                <Th>Remarque</Th>
                <Th>Nom du projet</Th>
                <Th>Temps en heure</Th>
                <Th>Taches</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cvsArray.map((item, i) => {
                <Tr key={i}>
                  <Td>{item.EmailAdress}</Td>
                  <Td>{item.Date}</Td>
                  <Td>{item.NomDuProjet}</Td>
                  <Td>{item.TempsEnHeure}</Td>
                  <Td>{item.Taches}</Td>
                </Tr>;
              })}
              ;
            </Tbody>
          </Table>
          ;
        </Box>
      </PageContent>
    </Page>
  );
};
