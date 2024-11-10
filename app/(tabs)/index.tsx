import Spinner from "@/components/Spinner";
import UserBox from "@/components/UserBox";
import useSupabase from "@/hooks/useSupabase";
import { getUsers } from "@/libs/supabase";
import { FlatList, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { data: users, isLoading, refetch } = useSupabase(getUsers);
  if (isLoading) return <Spinner size="large" />;
  return (
    <SafeAreaView className="flex-1  p-5 bg-gray-900">
      <View className="flex-1 mt-5">
        <View className=" mb-7 flex-row items-center">
          <Text className="text-green-600 text-xl font-semibold">Welcome </Text>
          <Text className="text-2xl text-green-500 font-bold">Abdelaziz !</Text>
        </View>
        <View className="mb-10">
          <FlatList
            data={users}
            renderItem={({ item }) => <UserBox user={item} />}
            onRefresh={refetch}
            refreshing={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
