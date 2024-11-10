import { View, Text, Image } from "react-native";
import React from "react";
import { User } from "@/types/types";

const UserBox = ({ user }: { user: User }) => {
  return (
    <View className="bg-gray-800/90 rounded-xl p-5 flex-row items-center shadow-lg my-2">
      <Image
        source={{ uri: user.image }}
        className="w-20 h-20 rounded-md border-2 border-green-500/30"
      />
      <View className="ml-4 flex-1">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-xl font-bold">{user.name}</Text>
          <View className="bg-green-500/20 px-4 py-1.5 rounded-full flex items-center justify-center">
            <Text className="text-green-400 font-semibold text-sm">
              {user.team}
            </Text>
          </View>
        </View>
        <Text className="text-gray-400 text-base">{user.role}</Text>
      </View>
    </View>
  );
};

export default UserBox;
