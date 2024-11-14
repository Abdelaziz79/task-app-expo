import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { createTeam } from "@/libs/supabase";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName) {
      Toast.show({
        type: "errorDark",
        text1: "Team name is required",
      });
      return;
    }
    try {
      setIsLoading(true);
      await createTeam({ name: teamName, description: teamDescription });

      setTeamName("");
      setTeamDescription("");
      Toast.show({
        type: "successDark",
        text1: "Team Created",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "errorDark",
        text1: "Failed to Create Team",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="p-5 flex-1 bg-gray-900">
      <Header
        title="Create Team"
        description="Create a new team"
        icon={<Plus size={24} color="white" />}
      />
      <ScrollView>
        <View className="bg-gray-800/90 rounded-xl p-2 shadow-lg ">
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
