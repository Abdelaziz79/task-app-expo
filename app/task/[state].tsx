import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import { useUserContext } from "@/contexts/UserContext";
import useSupabase from "@/hooks/useSupabase";
import { getTasksByState } from "@/libs/supabase";
import { useLocalSearchParams } from "expo-router";
import { ListIcon } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskState = () => {
  const { state } = useLocalSearchParams();
  const { user } = useUserContext();
  const {
    data: tasks,
    isLoading,
    refetch,
  } = useSupabase<any>(() => getTasksByState(state as string));
  if (isLoading) return <Loading />;
  const stateTitle = state as string;
  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-5">
      <Header
        title={
          stateTitle.charAt(0).toUpperCase() + stateTitle.slice(1) + " Tasks"
        }
        description={`${tasks?.length} tasks`}
        icon={<ListIcon size={24} color="white" />}
      />
      <FlatList
        refreshing={isLoading}
        onRefresh={refetch}
        data={tasks}
        renderItem={({ item }) => (
          <TaskCard
            currentUserId={user?.id || ""}
            task={item}
            showSeen
            showCompleteButton={false}
            fromUser={true}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default TaskState;
