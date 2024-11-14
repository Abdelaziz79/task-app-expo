import { useState } from "react";

import { useCallback } from "react";

export default function useRefresh(refetch: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);
  return { refreshing, onRefresh };
}
