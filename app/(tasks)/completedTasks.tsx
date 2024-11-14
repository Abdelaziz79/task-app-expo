import { useUserContext } from "@/contexts/UserContext";
import useSupabase from "@/hooks/useSupabase";
import { getCompletedTasks } from "@/libs/supabase";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import useRefresh from "@/hooks/useRefresh";
import { ListIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompletedTasksScreen() {
  const { user } = useUserContext();
  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch,
  } = useSupabase<any>(() => getCompletedTasks(user?.id ?? ""));

  const { refreshing, onRefresh } = useRefresh(refetch);
  if (tasksLoading) return <Loading />;

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <View className="flex-1">
        <Header
          title="Completed Tasks"
          description={`${tasks?.length} completed tasks`}
          icon={<ListIcon size={24} color="white" />}
        />
        <ScrollView
          className=""
          refreshControl={
            <RefreshControl
              tintColor="white"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {tasks && tasks.length > 0 ? (
            <View className="flex-1">
              {tasks.map((task: any) => (
                <TaskCard
                  currentUserId={user?.id || ""}
                  key={task.id}
                  task={task}
                />
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400">No tasks available</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
