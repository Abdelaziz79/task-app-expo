import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function useSupabase<T>(fn: () => Promise<any>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = await fn();
      setData(data);
    } catch (error: any) {
      Alert.alert("error", error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return { data, isLoading, refetch: getData };
}
