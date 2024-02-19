import { useMutation } from 'react-query';

import { useUserKafkaCluster } from 'hooks/storages/useUserKafkaCluster';

export interface PartitionDistributeRequest {
  topic: string;
  groupId: string;
  ignoredPartitions: Number[];
}

export const usePartitionDistributeMutation = () => {
  const kafkaCluster = useUserKafkaCluster((x) => x.kafkaCluster);
  const { mutate } = useMutation<unknown, unknown, PartitionDistributeRequest>({
    mutationFn: async (request) => {
      var url = `${KB_ENVIRONMENTS.KB_API}/partition-event`;
      const res = await fetch(url, {
        body: JSON.stringify(request),
        method: 'POST',
        headers: { 'kafka-id': kafkaCluster.id },
      });

      if (!res.ok) {
        throw new Error((await res.json())['message']);
      }

      return res.json();
    },
  });

  return { mutate };
};
