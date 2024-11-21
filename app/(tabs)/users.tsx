import Header from "@/components/Header";
import Loading from "@/components/Loading";
import UserBox from "@/components/UserBox";
import useSupabase from "@/hooks/useSupabase";
import { getUsers } from "@/libs/supabase";
import { User } from "@/types/types";
import { router } from "expo-router";
import { UserRoundPlus } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Users = () => {
  const { data: users, isLoading, refetch } = useSupabase<User[]>(getUsers);
  if (isLoading) return <Loading />;
  return (
    <SafeAreaView className="flex-1  p-5 bg-gray-900">
      <Header
        title="All Users"
        description="All users"
        icon={
          <TouchableOpacity
            onPress={() => router.push("/createUser")}
            className="flex flex-col items-center justify-center gap-1"
          >
            <UserRoundPlus size={24} color="white" />
            <Text className="text-white text-xs font-semibold">
              Create User
            </Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={users}
        renderItem={({ item }) => <UserBox user={item} />}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
};

export default Users;
