import { useUserContext } from "@/contexts/UserContext";
import useSupabase from "@/hooks/useSupabase";
import { getUserTasks } from "@/libs/supabase";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TaskCard from "@/components/TaskCard";
import useRefresh from "@/hooks/useRefresh";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function TasksScreen() {
  const { logout, user } = useUserContext();
  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch,
  } = useSupabase<any>(() => getUserTasks(user?.id ?? ""));

  const { refreshing, onRefresh } = useRefresh(refetch);
  const router = useRouter();
  if (tasksLoading) return <Loading />;

  const handleSignOut = async () => {
    try {
      await logout();
      Toast.show({
        type: "successDark",
        text1: "Signed out successfully",
      });
      router.replace("/");
    } catch (error) {
      Toast.show({
        type: "errorDark",
        text1: "Error signing out",
      });
    }
  };
  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <View className="flex-1">
        <Header
          title="Your Tasks"
          description={`${tasks?.length} tasks`}
          icon={
            <TouchableOpacity onPress={handleSignOut}>
              <LogOut size={24} color="white" />
            </TouchableOpacity>
          }
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
                  key={task.id}
                  task={task}
                  currentUserId={user?.id || ""}
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
