import Spinner from "@/components/Spinner";
import { createTeam } from "@/libs/supabase";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName) {
      Alert.alert("Error", "Team name is required");
      return;
    }
    try {
      setIsLoading(true);
      console.log(teamName, teamDescription);
      await createTeam({ name: teamName, description: teamDescription });
      Alert.alert("Team Created", "Team has been created successfully");
      setTeamName("");
      setTeamDescription("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to Create Team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="p-5 flex-1 bg-gray-900">
      <ScrollView>
        <View className="bg-gray-800/90 rounded-xl p-5 shadow-lg mt-5">
          <Text className="text-white text-2xl font-bold mb-5">
            Create New Team
          </Text>

          {/* Team Name Input */}
          <TextInput
            className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 mb-4 text-white"
            placeholder="Team Name"
            placeholderTextColor="gray"
            value={teamName}
            onChangeText={setTeamName}
          />

          {/* Team Description Input */}
          <TextInput
            className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 mb-4 text-white"
            placeholder="Team Description"
            placeholderTextColor="gray"
            value={teamDescription}
            onChangeText={setTeamDescription}
          />

          {/* Create Team Button */}
          <TouchableOpacity
            onPress={handleCreateTeam}
            className="p-4 border border-green-500/30 rounded-xl items-center bg-gray-900/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="small" />
            ) : (
              <Text className="text-green-400 font-semibold">Create Team</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTeam;
