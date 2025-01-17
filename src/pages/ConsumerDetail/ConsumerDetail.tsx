import { useLocation, useNavigate } from 'react-router-dom';

import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  StackDivider,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import CustomAlertDialog from 'components/CustomAlertDialog';
import { RefreshButton } from 'components/RefreshButton';

import { useConsumerInformationQuery } from 'hooks/services/useConsumerInformationQuery';
import { useDeleteConsumerGroupMutation } from 'hooks/services/useDeleteConsumerGroupMutation';

import ConsumerDetailTopic from './ConsumerDetailTopic';
const ConsumerDetail = () => {
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const group_id = location.pathname.replace('/consumers/', '');
  const { mutate } = useDeleteConsumerGroupMutation();
  const { isLoading, data, refetch, isRefetching } =
    useConsumerInformationQuery(group_id);

  const onButtonClicked = () => {
    refetch();
  };

  const onButtonClickedDeleted = () => {
    mutate(group_id, {
      onSuccess() {
        navigate(`/consumers`);
      },
      onError(error, variables, context) {
        toast({
          title: 'Error',
          description: (error as any).message,
          status: 'error',
          duration: 2000,
          position: 'top-right',
          isClosable: true,
        });
        onClose();
      },
    });
  };

  return (
    <Flex className="flex-col flex-1" gap={3}>
      <Flex width="100%" maxWidth="100%" gap={2}>
        <Flex>
          <Text as="b" alignSelf="center" fontSize="2xl" color="gray.700">
            {group_id}
          </Text>
        </Flex>
        <RefreshButton
          isLoading={isLoading || isRefetching}
          onButtonClicked={onButtonClicked}></RefreshButton>
        <Tooltip label="Delete Group" placement="left" backgroundColor="red">
          <IconButton
            style={{ marginLeft: 'auto', marginRight: '20px' }}
            onClick={() => onOpen()}
            icon={<DeleteIcon />}
            colorScheme="red"
            aria-label="delete"
          />
        </Tooltip>
      </Flex>
      <Box borderWidth="1px" borderRadius="lg" maxW="max">
        <HStack spacing="1px" divider={<StackDivider borderColor="gray.200" />}>
          {data !== undefined && (
            <Stat p="4">
              <StatLabel>State</StatLabel>
              <StatNumber>{data['state']}</StatNumber>
            </Stat>
          )}
          {data !== undefined && (
            <Stat p="4">
              <StatLabel>Members</StatLabel>
              <StatNumber>{data['member_count']}</StatNumber>
            </Stat>
          )}
          {data !== undefined && (
            <Stat p="4" minW="max">
              <StatLabel>Protocol</StatLabel>
              <StatNumber>{data['protocol']}</StatNumber>
            </Stat>
          )}
          {data !== undefined && (
            <Stat p="4" minW="max">
              <StatLabel>Pod Count</StatLabel>
              <StatNumber>{data['pod_count']}</StatNumber>
            </Stat>
          )}
        </HStack>
      </Box>
      <Flex className="flex-col flex-1">
        <Box borderWidth="1px" borderRadius="lg">
          <ConsumerDetailTopic group_id={group_id}></ConsumerDetailTopic>
        </Box>
      </Flex>
      <CustomAlertDialog
        isOpen={isOpen}
        onButtonClickedOk={onButtonClickedDeleted}
        onClose={onClose}
        message="You are trying to delete the consumer group?"
        okText="Remove"
      />
    </Flex>
  );
};

export default ConsumerDetail;
