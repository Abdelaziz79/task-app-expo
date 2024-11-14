import Header from "@/components/Header";
import LinkComp from "@/components/LinkComp";
import Loading from "@/components/Loading";
import StateBox from "@/components/StateBox";
import { useUserContext } from "@/contexts/UserContext";
import useRefresh from "@/hooks/useRefresh";
import useSupabase from "@/hooks/useSupabase";
import { getTasks } from "@/libs/supabase";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const { logout, user } = useUserContext();
  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch,
  } = useSupabase<any>(getTasks);
  const { onRefresh, refreshing } = useRefresh(refetch);
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

  const getTaskStats = () => {
    if (!tasks) return { total: 0, pending: 0, completed: 0 };
    const total = tasks.length;
    const pending = tasks.filter((task: any) => !task.finished).length;
    const completed = total - pending;
    return { total, pending, completed };
  };

  const getCompletionPercentage = () => {
    const stats = getTaskStats();
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <View>
        <Header
          title={`Welcome ${user?.name} !`}
          description="Your tasks and stats"
          icon={
            <TouchableOpacity onPress={handleSignOut}>
              <LogOut size={24} color="white" />
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
      >
        <View className="flex-1">
          <View className="items-center mb-6">
            <CircularProgress
              value={getCompletionPercentage()}
              radius={70}
              duration={2000}
              progressValueColor={"#fff"}
              maxValue={100}
              title={"Completed"}
              titleColor={"#9CA3AF"}
              titleStyle={{ fontWeight: "400" }}
              activeStrokeColor={"#22C55E"}
              inActiveStrokeColor={"#EAB308"}
              inActiveStrokeOpacity={0.2}
              inActiveStrokeWidth={6}
              activeStrokeWidth={6}
            />
            <ChartLegend />
          </View>
          <View className="flex-row justify-between mb-8 mt-4 gap-2">
            <StateBox title="Total Tasks" value={getTaskStats().total} />
            <StateBox
              title="Pending"
              value={getTaskStats().pending}
              valueColor="text-yellow-500"
            />
            <StateBox
              title="Completed"
              value={getTaskStats().completed}
              valueColor="text-green-500"
            />
          </View>

          <View className="space-y-4 flex flex-col gap-2">
            <LinkComp
              href={"/task/all"}
              title="All Tasks"
              description="View and manage all your tasks"
            />
            <LinkComp
              href="/task/pending"
              title="Pending Tasks"
              description="Focus on unfinished tasks"
            />
            <LinkComp
              href="/task/completed"
              title="Completed Tasks"
              description="Review finished tasks"
            />
            <LinkComp
              href="/(tasks)/tasks"
              title="Go to your tasks"
              description="Show my tasks"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const ChartLegend = () => (
  <View className="flex-row justify-center gap-4  mt-2">
    <View className="flex-row items-center">
      <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
      <Text className="text-gray-400 text-xs">Completed</Text>
    </View>
    <View className="flex-row items-center">
      <View className="w-2 h-2 rounded-full bg-yellow-500 opacity-20 mr-2" />
      <Text className="text-gray-400 text-xs">Pending</Text>
    </View>
  </View>
);
