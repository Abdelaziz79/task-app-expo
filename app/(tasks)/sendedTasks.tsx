import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import { useUserContext } from "@/contexts/UserContext";
import useSupabase from "@/hooks/useSupabase";
import { getTasksByUser } from "@/libs/supabase";
import { ListIcon } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SendedTasks = () => {
  const { user, isLoading } = useUserContext();
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    refetch,
  } = useSupabase<any>(() => getTasksByUser(user?.id || ""));
  if (isLoading || isLoadingTasks) return <Loading />;
  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-5">
      <Header
        title="Sended Tasks"
        description={`${tasks?.length} sended tasks`}
        icon={<ListIcon size={24} color="white" />}
      />
      <FlatList
        refreshing={isLoadingTasks}
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

export default SendedTasks;
