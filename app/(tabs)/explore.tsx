import useSupabase from "@/hooks/useSupabase";
import { getTeams } from "@/libs/supabase";
import { Team } from "@/types/types";
import { router } from "expo-router";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TeamBox from "@/components/TeamBox";
import useRefresh from "@/hooks/useRefresh";
import { Plus, Users2Icon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const { data: teams, isLoading, refetch } = useSupabase<Team[]>(getTeams);
  const { refreshing, onRefresh } = useRefresh(refetch);

  if (isLoading) return <Loading />;

  const handleTeamPress = (name: string) => {
    router.push(`/team/${name}`);
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <Header
        title="All Teams"
        description="All teams"
        icon={
          <TouchableOpacity
            onPress={() => router.push("/createTeam")}
            className="flex flex-col items-center justify-center gap-1"
          >
            <View className="flex flex-row items-center">
              <Users2Icon size={24} color="white" />
              <Plus size={16} style={{ marginLeft: -3 }} color="white" />
            </View>
            <Text className="text-white text-xs font-semibold">
              Create Team
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Teams List Section */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex flex-row flex-wrap gap-2 ">
          {teams &&
            teams?.map((team: Team) => (
              <TeamBox
                team={team}
                handleTeamPress={handleTeamPress}
                key={team.id}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
