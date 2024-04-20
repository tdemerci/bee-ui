import { useState } from 'react';

import {
  Flex,
  HStack,
  Input,
  Select,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import { RefreshButton } from 'components/RefreshButton';

import MessageItem from 'hooks/messagePaginations/MessageItem';
import MessageItemPage from 'hooks/messagePaginations/MessageItemPage';
import {
  TopicMessageDto,
  useTopMessagesQuery,
} from 'hooks/services/useTopMessagesQuery';

export const TopicDetailMessage = ({ topic_name, partition_count }: any) => {
  const [requestParam, setRequestParam] = useState<TopicMessageDto>({
    topic: topic_name,
    size: 10,
    partition: undefined,
  });
  const { isLoading, data, refetch, isRefetching } =
    useTopMessagesQuery(requestParam);

  const [filterKeyword, setFilterKeyword] = useState('');
  const searchFilterHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterKeyword(event.target.value);
  };

  const onSelectChangedPartition = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRequestParam({ ...requestParam, partition: Number(event.target.value) });
  };

  const onSelectChangedSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRequestParam({ ...requestParam, size: Number(event.target.value) });
  };

  const onButtonClickedRefresh = () => {
    refetch();
  };

  return (
    <Flex className="flex-col" width="100%">
      <HStack spacing="20px" mb="3" width="100%" alignItems="end">
        <Flex>
          <VStack spacing="0px">
            <Text as="b" fontSize="2xs" alignSelf="baseline" color="gray.500">
              PARTITION
            </Text>
            <Select fontSize="sm" onChange={onSelectChangedPartition}>
              {(() => {
                const options = [];
                options.push(
                  <option key="-1" value={undefined}>
                    ALL
                  </option>
                );
                for (let i = 0; i < partition_count; i++) {
                  options.push(
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                }
                return options;
              })()}
            </Select>
          </VStack>
        </Flex>
        <Flex>
          <VStack spacing="0px">
            <Text as="b" fontSize="2xs" color="gray.500" alignSelf="baseline">
              SIZE
            </Text>
            <Select fontSize="sm" onChange={onSelectChangedSize}>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="250">250</option>
              <option value="1000">1000</option>
            </Select>
          </VStack>
        </Flex>
        <Flex>
          <RefreshButton
            isLoading={isLoading || isRefetching}
            onButtonClicked={onButtonClickedRefresh}></RefreshButton>
        </Flex>
        <VStack
          spacing="0px"
          direction="column"
          style={{ marginLeft: 'auto' }}
          alignItems="end"
          justifyContent="center">
          <Tooltip
            hasArrow
            label="Keyword filters only fetched events."
            placement="left-end">
            <Text as="b" fontSize="2xs" color="gray.500" alignSelf="baseline">
              FILTER
            </Text>
          </Tooltip>
          <Input
            borderRadius="md"
            style={{ width: '200px' }}
            value={filterKeyword}
            onChange={searchFilterHandleChange}
          />
        </VStack>
      </HStack>
      {data !== undefined && Array.isArray(data) && (
        <MessageItemPage
          pageItems={data}
          filterKeyword={filterKeyword}
          MessageItem={MessageItem}
          messageItemProps={{
            topicName: topic_name,
          }}></MessageItemPage>
      )}
    </Flex>
  );
};

export default TopicDetailMessage;
