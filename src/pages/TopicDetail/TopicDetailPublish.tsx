import { useEffect, useState } from 'react';
import React from 'react';
import { useGetMessage } from 'services';

import { DownloadIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';

import MessagePublishAlertDialog from 'components/MessagePublishAlertDialog';

import { usePublishMessageMutation } from 'hooks/services/usePublishMessageMutation';

export const TopicDetailPublish = ({ topic_name }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventMessage, setEventMessage] = useState('');
  const [eventHeader, setEventHeader] = useState('');
  const [eventKey, setEventKey] = useState('');

  const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEventMessage(event.target.value);
  };

  const textAreaHeaderChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEventHeader(event.target.value);
  };

  const onInputKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventKey(event.target.value);
  };

  const [isSearchingEnabled, setIsSearchingEnabled] = useState(false);
  const { isLoading, data, refetch, isRefetching } = useGetMessage(
    topic_name,
    undefined,
    undefined,
    isSearchingEnabled
  );

  const { mutate } = usePublishMessageMutation(topic_name);

  useEffect(() => {
    if (data !== undefined && !isLoading && !isRefetching) {
      setEventMessage(JSON.stringify(data['value'], null, 2));
      if (data['headers'] !== null)
        setEventHeader(JSON.stringify(data['headers'], null, 2));

      setEventKey(data['key']);
    }
  }, [data, isLoading, isRefetching]);

  const onClickedButtonGetMessage = () => {
    setIsSearchingEnabled(true);
    refetch();
    console.log('onClickedButtonGetMessage');
  };

  const onClickedButtonPublish = () => {
    onOpen();
  };

  const onClickedButtonOk = () => {
    debugger;
    var headerObject =
      eventHeader !== ''
        ? JSON.parse(JSON.stringify(eventHeader)).replaceAll('\n', '')
        : undefined;

    var keyValue = eventKey !== '' ? eventKey : undefined;
    mutate({
      key: keyValue,
      headers: headerObject,
      value: eventMessage,
    });
    onClose();
  };

  return (
    <>
      <TableContainer w="100%">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
              <Th textAlign="right">
                <Button
                  onClick={() => onClickedButtonGetMessage()}
                  rightIcon={<DownloadIcon />}
                  isDisabled={isLoading || isRefetching}
                  isLoading={isLoading || isRefetching}
                  bgColor="#f27a1a"
                  _hover={{ bg: '#f59547' }}
                  color="white">
                  Get Message
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Flex>Key: </Flex>
              </Td>
              <Td>
                <Input
                  value={eventKey}
                  onChange={onInputKeyChange}
                  width="700px"
                  minHeight="10px"></Input>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Flex>Headers: </Flex>
              </Td>
              <Td>
                <Textarea
                  value={eventHeader}
                  onChange={textAreaHeaderChange}
                  placeholder={JSON.stringify(
                    [{ key: 'value' }, { key2: 'value' }],
                    null,
                    2
                  )}
                  width="700px"
                  height="100px">
                  {eventHeader}
                </Textarea>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Flex>Value: </Flex>
              </Td>
              <Td>
                <Textarea
                  width="700px"
                  height="350px"
                  resize="vertical"
                  value={eventMessage}
                  onChange={textAreaChange}>
                  {eventMessage}
                </Textarea>
              </Td>
            </Tr>
          </Tbody>
          <TableCaption>
            <Flex className="flex-col flex-1">
              <Button
                onClick={() => onClickedButtonPublish()}
                bgColor="#f27a1a"
                _hover={{ bg: '#f59547' }}
                color="white">
                Publish
              </Button>
            </Flex>
          </TableCaption>
        </Table>
      </TableContainer>
      <MessagePublishAlertDialog
        isOpen={isOpen}
        onButtonClickedOk={onClickedButtonOk}
        onClose={onClose}
      />
    </>
  );
};

export default TopicDetailPublish;

const styles: { [name: string]: React.CSSProperties } = {
  container: {
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textareaDefaultStyle: {
    padding: 5,
    width: 600,
    display: 'block',
    resize: 'none',
    backgroundColor: 'white',
  },
};
