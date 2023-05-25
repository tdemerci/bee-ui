import { useGetTopicConfiguration } from 'services';

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

export const TopicDetailConfiguration = ({ topic_name }: any) => {
  const { isLoading, data } = useGetTopicConfiguration(topic_name);

  return (
    <TableContainer maxWidth="100%">
      <Table size="sm" maxWidth="100%">
        <Thead maxWidth="100%">
          <Tr>
            <Th>Prodperty</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data !== undefined &&
            data.map((item: any, index: number) => (
              <Tr key={index}>
                {Object.keys(item).map((item: any) => (
                  <Td key="0">{item}</Td>
                ))}
                {Object.values(item).map((item: any) => (
                  <Td
                    key="1"
                    maxW="xl"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis">
                    {item}
                  </Td>
                ))}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TopicDetailConfiguration;
