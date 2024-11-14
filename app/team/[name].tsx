import Header from "@/components/Header";
import Loading from "@/components/Loading";
import UserBox from "@/components/UserBox";
import { useUserContext } from "@/contexts/UserContext";
import useRefresh from "@/hooks/useRefresh";
import useSupabase from "@/hooks/useSupabase";
import {
  addUserToTeam,
  getTeamByName,
  getUsersByTeamName,
  getUsersNames,
} from "@/libs/supabase";
import { Team, User } from "@/types/types";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Users2Icon } from "lucide-react-native";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function TeamDetailScreen() {
  const { name } = useLocalSearchParams();
  const { user: currentUser } = useUserContext();
  const { data: team, isLoading } = useSupabase<Team>(() =>
    getTeamByName(name as string)
  );
  const { data: usersNames } = useSupabase<User[]>(() => getUsersNames());
  const {
    data: users,
    isLoading: usersLoading,
    refetch,
  } = useSupabase<User[]>(() => getUsersByTeamName(name as string));

  const { refreshing, onRefresh } = useRefresh(refetch);

  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Filter out users that are already in the team
  const availableUsers = usersNames?.filter(
    (user) => !users?.some((teamUser) => teamUser.id === user.id)
  );

  if (isLoading || usersLoading) return <Loading />;
  const handleAddUserToTeam = async (userId: string) => {
    try {
      await addUserToTeam(userId, name as string);
      await refetch();
      Toast.show({
        text1: "User added to team",
        type: "successDark",
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      Toast.show({
        text1: "Failed to add user",
        type: "errorDark",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <Header
        title={team?.name || ""}
        description={`${users?.length} members`}
        icon={<Users2Icon size={24} color="white" />}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex flex-col gap-3 space-y-6">
          {/* Team Header Section */}

          {/* Team Members Section */}
          <View>
            {users?.map((user) => (
              <UserBox showTeam={false} key={user.id} user={user} />
            ))}
          </View>

          {/* New Add Users Section - Only visible for superAdmin */}
          {currentUser?.role === "superAdmin" && (
            <LinearGradient
              colors={["rgba(31, 41, 55, 0.8)", "rgba(17, 24, 39, 0.95)"]}
              className="rounded-[32px] border border-gray-700/30 overflow-hidden"
              style={{ elevation: 5 }}
            >
              <View className="p-6">
                <Text className="text-white text-xl font-bold tracking-wide mb-6">
                  Add Team Member
                </Text>
                <View className="bg-gray-800/80 rounded-2xl overflow-hidden mb-4 border border-gray-700/50">
                  <Picker
                    selectedValue={selectedUserId}
                    onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                    style={{
                      color: "#fff",
                      height: 50,
                    }}
                    dropdownIconColor="#fff"
                  >
                    <Picker.Item label="Select a user..." value="" />
                    {availableUsers?.map((user) => (
                      <Picker.Item
                        key={user.id}
                        label={user.name}
                        value={user.id}
                      />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedUserId) {
                      handleAddUserToTeam(selectedUserId);
                      setSelectedUserId("");
                    }
                  }}
                  disabled={!selectedUserId}
                >
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    className="rounded-xl py-3 items-center overflow-hidden"
                    style={{ opacity: selectedUserId ? 1 : 0.5 }}
                  >
                    <Text className="text-white font-bold text-lg">
                      Add to Team
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
