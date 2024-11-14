import Header from "@/components/Header";
import Loading from "@/components/Loading";
import UserBox from "@/components/UserBox";
import useSupabase from "@/hooks/useSupabase";
import { getUsers } from "@/libs/supabase";
import { User } from "@/types/types";
import { UserSquare } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Users = () => {
  const { data: users, isLoading, refetch } = useSupabase<User[]>(getUsers);
  if (isLoading) return <Loading />;
  return (
    <SafeAreaView className="flex-1  p-5 bg-gray-900">
      <Header
        title="All Users"
        description="All users"
        icon={<UserSquare size={24} color="white" />}
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
