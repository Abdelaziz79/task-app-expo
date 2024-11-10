import Spinner from "@/components/Spinner";
import useSupabase from "@/hooks/useSupabase";
import { createUser, getTeams, uploadImage } from "@/libs/supabase";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ImageFile {
  uri: string;
  type: string;
  name: string;
  base64: string | null | undefined;
}

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<ImageFile | null>(null);
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const { data: teams, isLoading, refetch } = useSupabase(getTeams);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) return <Spinner size="large" />;

  const handleCreateUser = async () => {
    if (!name || !password || !image || !team || !role) {
      return Alert.alert("Error", "Please fill all the fields");
    }
    try {
      setIsCreating(true);
      const imageUrl = await uploadImage(image);
      const user = await createUser({
        name,
        password,
        image: imageUrl,
        team,
        role,
        email,
      });
      Alert.alert("Success", "User Created Successfully");
      setName("");
      setPassword("");
      setImage(null);
      setTeam("");
      setRole("user");
      setEmail("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to Create User");
    } finally {
      setIsCreating(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileExtension = uri.split(".").pop();

      const imageFile = {
        uri,
        type: `image/${fileExtension}`,
        name: `upload.${fileExtension}`,
        base64: result.assets[0].base64,
      };

      setImage(imageFile);
    }
  };

  return (
    <SafeAreaView className="p-5 flex-1 bg-gray-900">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-gray-800/90 rounded-xl p-5 shadow-lg mt-5">
          <Text className="text-white text-2xl font-bold mb-5">
            Create New User
          </Text>

          <TextInput
            className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 mb-4 text-white"
            placeholder="Name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 mb-4 text-white"
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 mb-4 text-white"
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
          />

          <View className="mb-4">
            <TouchableOpacity
              onPress={pickImage}
              className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 flex-row justify-between items-center"
            >
              <Text className="text-gray-400">
                {image ? "Change Image" : "Pick an Image"}
              </Text>
              {image && (
                <Image
                  source={{ uri: image.uri }}
                  className="w-14 h-14 rounded-md"
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 mb-2">Select Team:</Text>
            <View className="bg-gray-900/90 border border-green-500/30 rounded-xl overflow-hidden">
              <Picker
                style={{ color: "white" }}
                selectedValue={team}
                onValueChange={(itemValue) => setTeam(itemValue)}
                className="h-12"
              >
                <Picker.Item label="Select a team" value="" />
                {teams.map(({ name: teamName, id }) => (
                  <Picker.Item key={id} label={teamName} value={id} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 mb-2">Select Role:</Text>
            <View className="flex-row gap-3">
              <Pressable
                className={`flex-1 p-4 border border-green-500/30 rounded-xl items-center ${
                  role === "user" ? "bg-green-500/20" : "bg-gray-900/90"
                }`}
                onPress={() => setRole("user")}
              >
                <Text className="text-green-400 font-semibold">User</Text>
              </Pressable>
              <Pressable
                className={`flex-1 p-4 border border-green-500/30 rounded-xl items-center ${
                  role === "admin" ? "bg-green-500/20" : "bg-gray-900/90"
                }`}
                onPress={() => setRole("admin")}
              >
                <Text className="text-green-400 font-semibold">Admin</Text>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity
            disabled={isCreating}
            onPress={handleCreateUser}
            className="p-4 border border-green-500/30 rounded-xl items-center"
          >
            {isCreating ? (
              <Spinner size="small" />
            ) : (
              <Text className="text-green-400 font-semibold">Create User</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateUser;
