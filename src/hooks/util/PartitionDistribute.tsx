import { useState } from 'react';

import { DeleteIcon, RepeatClockIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  StackDivider,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import { usePartitionDistributeDelete } from 'hooks/services/usePartitionDistributeDelete';
import { usePartitionDistributeMutation } from 'hooks/services/usePartitionDistributeMutation';
import { usePartitionDistributeQuery } from 'hooks/services/usePartitionDistributeQuery';

interface PartitionDistributeProps {
  TopicName: string;
  GroupId: string;
  Partition: number;
}

function PartitionDistribute({
  TopicName,
  GroupId,
  Partition,
}: PartitionDistributeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [getMessageEnabled, setGetMessageEnabled] = useState(false);
  const { isLoading, data, refetch, status } = usePartitionDistributeQuery(
    TopicName,
    GroupId,
    Partition,
    getMessageEnabled
  );

  const { mutate } = usePartitionDistributeMutation();
  const { mutateAsync } = usePartitionDistributeDelete();

  const onClickedButtonOpen = () => {
    setGetMessageEnabled(true);
    onOpen();
  };

  const onClickedButtonClose = () => {
    setGetMessageEnabled(false);
    onClose();
  };

  const onClickedButtonMutate = () => {
    mutate(
      {
        topic: TopicName,
        groupId: GroupId,
        ignoredPartitions: [Partition],
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const onClickedButtonDelete = () => {
    mutateAsync({
      topic: TopicName,
      partition: Partition.toString(),
    });
    setGetMessageEnabled(false);
    onClose();
  };

  return (
    <>
      <Tooltip label="Spread all messages to other partitions">
        <IconButton
          size="xs"
          icon={<RepeatClockIcon />}
          onClick={onClickedButtonOpen}
          aria-label="partition-distribute"></IconButton>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="xl"
        scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent>
          <ModalHeader>Selected Partition: {Partition}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <center>
                <Spinner size="xl" />
              </center>
            ) : data === undefined ? (
              <Button
                colorScheme="orange"
                mr={3}
                onClick={onClickedButtonMutate}>
                Start Process
              </Button>
            ) : (
              <Box borderWidth="1px" borderRadius="lg" maxW="min">
                <HStack
                  spacing="1px"
                  divider={<StackDivider borderColor="gray.200" />}>
                  <Stat p="4">
                    <StatLabel>Status</StatLabel>
                    <StatNumber>{data['status']}</StatNumber>
                  </Stat>
                  <Stat p="4">
                    <StatLabel>Actions</StatLabel>
                    <StatNumber textAlign="center">
                      <IconButton
                        onClick={() => onClickedButtonDelete()}
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="delete"
                      />
                    </StatNumber>
                  </Stat>
                </HStack>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={onClickedButtonClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PartitionDistribute;
