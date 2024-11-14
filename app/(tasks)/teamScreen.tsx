import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useUserContext } from "@/contexts/UserContext";
import { Users2Icon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeamScreen() {
  const { user, isLoading: isUserLoading } = useUserContext();
  if (isUserLoading) return <Loading />;

  const handleTeamPress = (name: string) => {
    router.push(`/team/${name}`);
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <Header
        title="Your Teams"
        description={`${user?.teams?.length} teams`}
        icon={<Users2Icon size={24} color="white" />}
      />

      {/* Teams List Section */}
      <ScrollView>
        <View className="flex flex-col gap-2">
          {user?.teams &&
            user?.teams?.map((team: string) => (
              <TouchableOpacity
                key={team}
                onPress={() => handleTeamPress(team)}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 "
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-green-500 text-xl font-bold mb-2"
                >
                  {team}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
