import { completeTask, seenTask } from "@/libs/supabase";
import { TaskCardProps } from "@/types/types";
import {
  ArrowRight,
  Check,
  CheckCheck,
  CheckCircle,
  Circle,
  Clock,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Image as RNImage,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function TaskCard({
  currentUserId,
  task,
  showSeen = false,
  showCompleteButton = true,
  fromUser = false,
}: TaskCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const markAsSeen = async () => {
      if (!task.seen && currentUserId !== "" && currentUserId === task.to.id) {
        await seenTask(task.id);
      }
    };
    markAsSeen();
  }, [task.id]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCompleteTask = async () => {
    await completeTask(task.id);
    setIsCompleted(true);
    Toast.show({
      type: "successDark",
      text1: "Task completed",
    });
  };

  const avatar = task.from.image;
  const name = task.from.name;
  const team = task.team;

  return (
    <>
      <View className="bg-gray-800/95 rounded-2xl p-5 mb-4 shadow-2xl border border-gray-700/30">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <RNImage
              source={{ uri: avatar }}
              className="w-16 h-16 rounded-xl shadow-lg"
            />
            <View className="ml-4 flex-1">
              <Text className="text-white font-bold text-lg" numberOfLines={1}>
                {name}
              </Text>
              <Text
                className="text-gray-400 text-sm font-medium"
                numberOfLines={1}
              >
                {team}
              </Text>
            </View>
          </View>
          {fromUser && (
            <>
              <View className="flex-row items-center mx-3">
                <ArrowRight width={24} height={24} color="#22c55e" />
              </View>
              <View className="flex-row items-center flex-1">
                <RNImage
                  source={{ uri: task.to.image }}
                  className="w-16 h-16 rounded-xl shadow-lg"
                />
                <View className="ml-4 flex-1">
                  <Text
                    className="text-white font-bold text-lg"
                    numberOfLines={1}
                  >
                    {task.to.name}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        <Text className="text-white text-base leading-6 mt-4 mb-5">
          {task.content}
        </Text>

        {task.images.length > 0 && (
          <ScrollView
            horizontal
            className=" mb-4"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row gap-2">
              {task.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(image)}
                  className="shadow-lg"
                >
                  <RNImage
                    source={{ uri: image }}
                    className="w-28 h-28 rounded-xl"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-400 text-xs font-medium">
            {formatDateTime(task.created_at)}
          </Text>
          {!task.finished && showCompleteButton && !isCompleted && (
            <TouchableOpacity
              onPress={handleCompleteTask}
              className="flex-row items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full"
            >
              <Circle size={18} color="#22c55e" strokeWidth={2} />
              <Text className="text-green-500  font-semibold">Complete</Text>
            </TouchableOpacity>
          )}
          <View className="flex-row items-center gap-2">
            {showSeen && (
              <View className="px-1  flex-row items-center gap-1">
                {task.seen ? (
                  <CheckCheck size={16} color="#22c55e" />
                ) : (
                  <Check size={16} color="#3b82f6" strokeWidth={2} />
                )}
                <Text className="text-white font-semibold">
                  {task.seen ? "Seen" : "Unseen"}
                </Text>
              </View>
            )}
            {task.finished || isCompleted ? (
              <View className="flex-row items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                <CheckCircle size={16} color="#22c55e" />
                <Text className="text-green-500 font-semibold">Completed</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                <Clock size={16} color="#eab308" />
                <Text className="text-yellow-500 font-semibold">Pending</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/95 justify-center items-center">
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            className="absolute top-12 right-6 z-10 bg-gray-800/90 rounded-full p-3"
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <RNImage
              source={{ uri: selectedImage }}
              style={{
                width: windowWidth * 0.95,
                height: windowHeight * 0.75,
                borderRadius: 16,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </>
  );
}
