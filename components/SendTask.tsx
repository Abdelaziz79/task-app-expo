import { uploadImage } from "@/libs/supabase";
import { ImageFile } from "@/types/types";
import * as ImagePicker from "expo-image-picker";
import { Camera, X } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Spinner from "./Spinner";

interface SendTaskProps {
  teams: string[];
  onSendTask: (content: string, images: string[], team: string) => void;
  to: string;
}

export default function SendTask({ teams, onSendTask, to }: SendTaskProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => {
        const uri = asset.uri;
        const fileExtension = uri.split(".").pop();
        return {
          uri,
          type: `image/${fileExtension}`,
          name: `upload.${fileExtension}`,
          base64: asset.base64,
        };
      });
      setImages([...images, ...newImages]);
    }
  };

  const pickImageFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImage = {
        uri: result.assets[0].uri,
        type: `image/${result.assets[0].uri.split(".").pop()}`,
        name: `upload.${result.assets[0].uri.split(".").pop()}`,
        base64: result.assets[0].base64,
      };
      setImages([...images, newImage]);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Toast.show({
        type: "errorDark",
        text1: "Please enter task description",
      });
      return;
    }

    try {
      setIsUploading(true);
      Toast.show({
        type: "infoDark",
        text1: "Uploading images...",
      });

      const uploadPromises = images.map(async (image) => {
        try {
          const imageUrl = await uploadImage(image);
          return imageUrl;
        } catch (error) {
          console.error("Error uploading single image:", error);
          Toast.show({
            type: "errorDark",
            text1: `Failed to upload image: ${image.name}`,
          });
          return null;
        }
      });

      const uploadedImageUrls = (await Promise.all(uploadPromises)).filter(
        (url) => url !== null
      );

      onSendTask(content, uploadedImageUrls, selectedTeam);

      setContent("");
      setImages([]);
      setSelectedTeam("");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Toast.show({
        type: "errorDark",
        text1: "Failed to upload images",
        text2:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-800">
      <Text className="text-2xl font-bold mb-6 text-green-500">
        Send New Task To {to}
      </Text>
      <View className="space-y-6">
        <View>
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Task Description
          </Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            className="bg-gray-900/90 border border-green-500/30 rounded-xl p-4 flex-row  text-white"
            placeholder="Describe the task..."
            placeholderTextColor="#ffffff80"
          />
        </View>

        {images.length > 0 && (
          <ScrollView horizontal className="flex-row gap-2 mt-4">
            {images.map((image, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri: image.uri }}
                  className="w-20 h-20 rounded-lg mx-1"
                />
                <TouchableOpacity
                  onPress={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={pickImages}
            className="flex-1 bg-gray-900/90 border border-green-500/30 rounded-xl p-4 flex-row justify-center items-center my-4"
          >
            <Text className="text-gray-400">Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImageFromCamera}
            className="flex-1 gap-1 bg-gray-900/90 border border-green-500/30 rounded-xl p-4 flex-row justify-center items-center my-4"
          >
            <Camera className="mr-2" size={20} color="#9CA3AF" />
            <Text className="text-gray-400">Camera</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Select Team
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {teams.map((team) => (
                <TouchableOpacity
                  key={team}
                  onPress={() => setSelectedTeam(team)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTeam === team
                      ? "bg-green-600"
                      : "bg-gray-900/90 border border-green-500/30"
                  }`}
                >
                  <Text
                    className={`${
                      selectedTeam === team ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {team}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          disabled={isUploading}
          onPress={handleSubmit}
          className="p-4 border border-green-500/30 rounded-xl items-center my-4"
        >
          {isUploading ? (
            <Spinner size="small" />
          ) : (
            <Text className="text-green-400 font-semibold ">Send Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
