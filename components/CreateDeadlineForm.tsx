import { createDeadline, uploadImage } from "@/libs/supabase";
import { ImageFile, User } from "@/types/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Calendar, Camera } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import Spinner from "./Spinner";
import StyledButton from "./StyledButton";

const CreateDeadlineForm = ({ user }: { user: User | null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
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
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!title) {
      Toast.show({
        text1: "Title is required",
        type: "errorDark",
      });
      return;
    }
    if (!date) {
      Toast.show({
        text1: "Finished date is required",
        type: "errorDark",
      });
      return;
    }
    if (!user) {
      Toast.show({
        text1: "User is required",
        type: "errorDark",
      });
      return;
    }
    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }
      await createDeadline({
        title,
        finish_date: date.toISOString(),
        user_id: user.id,
        description,
        image: imageUrl || undefined,
      });
      setTitle("");
      setDescription("");
      setDate(new Date());
      setImage(null);
      Toast.show({
        text1: "Deadline created successfully",
        type: "successDark",
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Something went wrong",
        type: "errorDark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* New Deadline Form */}
      <View className="bg-gray-800 p-4 rounded-lg mt-4">
        <Text className="text-white text-lg font-bold mb-4">
          Create New Deadline
        </Text>

        <View className="space-y-4">
          {/* Title Input */}
          <View>
            <Text className="text-gray-300 mb-2">Title</Text>
            <TextInput
              className="bg-gray-700 p-3 rounded-lg text-white"
              placeholderTextColor="#9CA3AF"
              placeholder="Enter deadline title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description Input */}
          <View>
            <Text className="text-gray-300 mb-2">Description</Text>
            <TextInput
              className="bg-gray-700 p-3 rounded-lg text-white"
              placeholderTextColor="#9CA3AF"
              placeholder="Enter description"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Image Upload */}
          <View>
            <Text className="text-gray-300 mb-2">Image</Text>
            <View className="mb-2">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={pickImage}
                  className="flex-1 bg-gray-700  rounded-xl p-4 flex-row justify-between items-center"
                >
                  <Text className="text-gray-400">
                    {image ? "Change Image" : "Pick from Gallery"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={takePhoto}
                  className="bg-gray-700 0 rounded-xl p-4 items-center justify-center w-14"
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
          </View>

          {/* Date Picker */}
          <View>
            <Text className="text-gray-300 mb-2">Finished Date</Text>
            <TouchableOpacity
              className="bg-gray-700 p-3 rounded-lg flex-row items-center justify-between"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white">{date.toLocaleDateString()}</Text>
              <Calendar size={20} color="white" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {/* Action Buttons */}
          <View className="mt-2">
            <StyledButton onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Spinner size="small" />
              ) : (
                <Text className="text-green-400 font-semibold">Save</Text>
              )}
            </StyledButton>
          </View>
        </View>
      </View>
    </>
  );
};

export default CreateDeadlineForm;
