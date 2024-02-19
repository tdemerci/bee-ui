import { useMutation } from 'react-query';

export const usePartitionDistributeDelete = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async ({ topic, partition }: any) => {
      var url = `${KB_ENVIRONMENTS.KB_API}/partition-event?topic=${topic}&ignoredPartitions=${partition}`;
      const res = await fetch(url, {
        method: 'DELETE',
      });
      return res.json();
    },
  });

  return { mutateAsync };
};
