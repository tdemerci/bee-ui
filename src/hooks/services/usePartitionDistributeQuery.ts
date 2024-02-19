import { useQuery } from 'react-query';

import { useUserKafkaCluster } from 'hooks/storages/useUserKafkaCluster';

export const usePartitionDistributeQuery = (
  topicName: string,
  groupId: string,
  partition: Number,
  enabled: boolean
) => {
  const kafkaCluster = useUserKafkaCluster((x) => x.kafkaCluster);
  var url = `${
    KB_ENVIRONMENTS.KB_API
  }/partition-event?topic=${topicName}&groupId=${groupId}&ignoredPartitions=${[
    partition,
  ]}`;
  const { isLoading, data, refetch, status } = useQuery({
    queryKey: ['partition-event', topicName, groupId, partition],
    queryFn: async () => {
      const res = await fetch(url, {
        headers: { 'kafka-id': kafkaCluster.id },
      });

      if (!res.ok) {
        return undefined;
      }

      return res.json();
    },
    enabled: enabled,
    retry: false,
    refetchInterval: (data) => {
      return data === undefined || data?.status === 'Completed' ? false : 2000;
    },
    refetchOnWindowFocus: false,
  });

  return { isLoading, data, refetch, status };
};
