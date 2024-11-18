import Loading from "@/components/Loading";
import SendTask from "@/components/SendTask";
import { useUserContext } from "@/contexts/UserContext";
import useRefresh from "@/hooks/useRefresh";
import useSupabase from "@/hooks/useSupabase";
import { createTask, getUserById } from "@/libs/supabase";
import { User as UserType } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const User = () => {
  const { id } = useLocalSearchParams();
  const {
    data: toUser,
    isLoading,
    refetch,
  } = useSupabase<UserType>(() => getUserById(id as string));
  const { isLoading: userLoading, user: fromUser } = useUserContext();
  const { onRefresh, refreshing } = useRefresh(refetch);
  const handleSendTask = async (
    content: string,
    images: string[],
    team: string
  ) => {
    if (!content.trim() || fromUser?.id === toUser?.id) {
      return;
    }
    try {
      const newTask = {
        from: fromUser?.id ?? "",
        to: toUser?.id ?? "",
        content,
        images,
        team,
        from_name: fromUser?.name ?? "",
        to_name: toUser?.name ?? "",
      };
      await createTask(newTask);
      Toast.show({
        type: "successDark",
        text1: "Task sent successfully",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "errorDark",
        text1: "Error sending task",
      });
    }
  };

  if (isLoading || userLoading) return <Loading />;

  const sameTeams =
    fromUser?.teams?.filter((team) => toUser?.teams?.includes(team)) ?? [];

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View className="items-center mb-8">
          <Image
            source={{ uri: toUser?.image }}
            className="w-32 h-32 rounded-[24px] "
          />
          <Text className="text-white text-3xl font-bold mt-4">
            {toUser?.name}
          </Text>
          <Text className="text-green-500 text-lg">{toUser?.role}</Text>
        </View>

        {/* User Details Card */}
        <View className="bg-gray-800 rounded-xl p-5 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-green-500 text-lg font-semibold">Email</Text>
            <Text className="text-white">{toUser?.email}</Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-green-500 text-lg font-semibold">Teams</Text>
            <View className="max-w-[60%]">
              <ScrollView horizontal className="  ">
                <Text className="text-white ">{toUser?.teams.join(", ")}</Text>
              </ScrollView>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-green-500 text-lg font-semibold">Joined</Text>
            <Text className="text-white">
              {toUser?.created_at
                ? new Date(toUser.created_at).toLocaleDateString()
                : "-"}
            </Text>
          </View>
        </View>

        <SendTask
          teams={sameTeams}
          to={toUser?.name ?? ""}
          onSendTask={handleSendTask}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;
