import { useUserContext } from "@/contexts/UserContext";
import { User } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const UserBox = ({
  user,
  showTeam = true,
}: {
  user: User;
  showTeam?: boolean;
}) => {
  const { user: currentUser } = useUserContext();
  const handlePress = () => {
    if (user.id == currentUser?.id) {
      Toast.show({
        text1: "This is you! You cannot send tasks to yourself",
        type: "errorDark",
      });
    } else router.push(`/user/${user.id}`);
  };

  return (
    <LinearGradient
      colors={["rgba(31, 41, 55, 0.8)", "rgba(17, 24, 39, 0.95)"]}
      className="rounded-[32px] overflow-hidden border border-gray-700/30 mx-3 my-2"
    >
      {/* Top accent bar */}
      <LinearGradient
        colors={[
          "rgba(16, 185, 129, 0.2)", // emerald
          "rgba(20, 184, 166, 0.2)", // teal
          "rgba(6, 182, 212, 0.2)", // cyan
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-20"
      />

      <View className="px-6 pb-6">
        <TouchableOpacity onPress={handlePress} className="">
          {/* Profile section */}
          <View className="flex-row items-start">
            <Image
              source={{ uri: user.image }}
              className="w-24 h-24 rounded-[24px] -mt-10 border-[3px] border-emerald-500/30"
            />
            <View className="ml-4 flex-1 mt-2">
              <Text className="text-white text-xl font-bold tracking-wide mb-1">
                {user.name}
              </Text>

              <Text className="text-gray-400 text-sm font-semibold">
                {user.role}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Teams section */}
        {showTeam && user.teams && user.teams.length > 0 && (
          <View className="mt-6">
            <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3 ml-1">
              TEAMS
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row -mx-1"
            >
              {user.teams.map((team, index) => (
                <LinearGradient
                  key={index}
                  colors={["rgba(31, 41, 55, 0.9)", "rgba(17, 24, 39, 0.9)"]}
                  className="mx-1 px-5 py-2.5 rounded-2xl border border-gray-700/50 overflow-hidden"
                >
                  <Text className="text-gray-300 font-semibold text-sm">
                    {team}
                  </Text>
                </LinearGradient>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default UserBox;
