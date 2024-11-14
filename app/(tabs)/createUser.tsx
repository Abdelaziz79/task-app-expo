import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Spinner from "@/components/Spinner";
import useRefresh from "@/hooks/useRefresh";
import useSupabase from "@/hooks/useSupabase";
import { createUser, getTeams, uploadImage } from "@/libs/supabase";
import { ImageFile, Team } from "@/types/types";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Camera, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<ImageFile | null>(null);
  const [team, setTeam] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const { data: teams, isLoading, refetch } = useSupabase<Team[]>(getTeams);
  const [isCreating, setIsCreating] = useState(false);
  const { refreshing, onRefresh } = useRefresh(refetch);

  if (isLoading) return <Loading />;

  const handleCreateUser = async () => {
    if (!name || !password || !image || !team || !role) {
      Toast.show({
        type: "errorDark",
        text1: "Please fill all the fields",
      });
      return;
    }
    try {
      setIsCreating(true);
      const imageUrl = await uploadImage(image);
      const user = await createUser({
        name,
        password,
        image: imageUrl,
        teams: [team],
        role,
        email: email.toLowerCase().trim(),
      });
      Toast.show({
        type: "successDark",
        text1: "User Created Successfully",
      });
      setName("");
      setPassword("");
      setImage(null);
      setTeam("");
      setRole("user");
      setEmail("");
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "errorDark",
        text1: "Failed to Create User",
      });
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

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
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
      <Header
        title="Create User"
        description="Create a new user"
        icon={<UserPlus size={24} color="white" />}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-gray-800/90 rounded-xl p-2 shadow-lg ">
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
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-1 bg-gray-900/90 border border-green-500/30 rounded-xl p-4 flex-row justify-between items-center"
              >
                <Text className="text-gray-400">
                  {image ? "Change Image" : "Pick from Gallery"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePhoto}
                className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 items-center justify-center w-14"
              >
                <Camera size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {image && (
              <View className="mt-3">
                <Image
                  source={{ uri: image.uri }}
                  className="w-20 h-20 rounded-md"
                />
              </View>
            )}
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
                {teams &&
                  teams.map(({ name: teamName, id }) => (
                    <Picker.Item key={id} label={teamName} value={teamName} />
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
