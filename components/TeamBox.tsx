import { Team } from "@/types/types";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const TeamBox = ({
  team,
  handleTeamPress,
}: {
  team: Team;
  handleTeamPress: (name: string) => void;
}) => {
  return (
    <TouchableOpacity
      key={team.id}
      onPress={() => handleTeamPress(team.name)}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 w-[31%]"
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="text-green-500 text-xl font-bold mb-2"
      >
        {team.name}
      </Text>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        className="text-green-600 text-sm"
      >
        {team.description}
      </Text>
      <Text className="text-gray-400 text-xs mt-2">
        Created: {new Date(team.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

export default TeamBox;
