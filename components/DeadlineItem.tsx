import { completeDeadline, deleteDeadlineById } from "@/libs/supabase";
import { Deadline as DeadlineType } from "@/types/types";
import { differenceInDays, format } from "date-fns";
import { CheckCircle2, X } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const DeadlineItem = ({
  deadline,
  refetch,
}: {
  deadline: DeadlineType;
  refetch: () => Promise<void>;
}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const getDaysUntilDeadline = () => {
    const today = new Date();
    const deadlineDate = new Date(deadline.finish_date);
    return differenceInDays(deadlineDate, today);
  };

  const getUrgencyColor = () => {
    if (deadline.complete) return "bg-green-500";
    const daysLeft = getDaysUntilDeadline();
    if (daysLeft <= 1) return "bg-red-500";
    if (daysLeft <= 3) return "bg-red-400";
    if (daysLeft <= 7) return "bg-orange-400";
    if (daysLeft <= 14) return "bg-yellow-400";
    return "bg-green-400";
  };

  const getTextColor = () => {
    if (deadline.complete) return "text-green-500";
    const daysLeft = getDaysUntilDeadline();
    if (daysLeft <= 1) return "text-red-500";
    if (daysLeft <= 3) return "text-red-400";
    if (daysLeft <= 7) return "text-orange-400";
    if (daysLeft <= 14) return "text-yellow-400";
    return "text-green-400";
  };

  const onDelete = async () => {
    try {
      await deleteDeadlineById(deadline?.id || "");
      Toast.show({
        text1: "Deadline deleted successfully",
        type: "successDark",
      });
      await refetch();
    } catch (error) {
      Toast.show({
        text1: "Error deleting deadline",
        type: "errorDark",
      });
    }
  };

  const onComplete = async () => {
    try {
      await completeDeadline(deadline?.id || "");
      Toast.show({
        text1: "Deadline completed successfully",
        type: "successDark",
      });
      await refetch();
    } catch (error) {
      Toast.show({
        text1: "Error completing deadline",
        type: "errorDark",
      });
    }
  };

  const renderRightActions = (_progress: any, dragX: any) => {
    return (
      <View className="w-full h-full justify-center bg-red-500 rounded-lg">
        <Text className="text-white text-right mx-2 text-lg">Delete</Text>
      </View>
    );
  };

  const renderLeftActions = (_progress: any, dragX: any) => {
    if (deadline.complete) return null;
    return (
      <View className="w-full h-full justify-center bg-green-500 rounded-lg">
        <Text className="text-white text-left mx-2 text-lg">Complete</Text>
      </View>
    );
  };

  const ImageModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={imageModalVisible}
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View className="flex-1 bg-black/90 justify-center items-center">
        <TouchableOpacity
          className="absolute top-10 right-5 z-10"
          onPress={() => setImageModalVisible(false)}
        >
          <X size={30} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: deadline.image }}
          className="w-full h-[70%]"
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  return (
    <>
      <ImageModal />
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        containerStyle={{
          marginBottom: 10,
        }}
        onSwipeableOpen={(direction) => {
          if (direction === "right") onDelete();
          if (direction === "left" && !deadline.complete) onComplete();
        }}
      >
        <View
          className={`bg-gray-800 rounded-lg p-4 shadow-lg ${
            deadline.complete ? "opacity-80" : ""
          }`}
        >
          <View className="flex-row">
            {deadline.image && (
              <TouchableOpacity
                onPress={() => setImageModalVisible(true)}
                className="mr-3"
              >
                <Image
                  source={{ uri: deadline.image }}
                  className={`w-20 h-20 rounded-lg ${
                    deadline.complete ? "opacity-70" : ""
                  }`}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-2">
                <Text
                  className={`text-xl font-bold text-white flex-1 mr-3 ${
                    deadline.complete ? "line-through opacity-70" : ""
                  }`}
                >
                  {deadline.title}
                </Text>
                {deadline.complete ? (
                  <CheckCircle2 size={20} color="#22c55e" />
                ) : (
                  <View
                    className={`w-5 h-5 rounded-full ${getUrgencyColor()}`}
                  />
                )}
              </View>

              {deadline.description && (
                <Text
                  className={`text-gray-400 mb-2 ${
                    deadline.complete ? "line-through opacity-70" : ""
                  }`}
                  numberOfLines={2}
                >
                  {deadline.description}
                </Text>
              )}

              <View className="mt-auto">
                <Text className={`font-semibold ${getTextColor()}`}>
                  {deadline.complete ? (
                    "Completed"
                  ) : (
                    <>
                      Due:{" "}
                      {format(new Date(deadline.finish_date), "MMM dd, yyyy")}
                      {getDaysUntilDeadline() <= 7 && !deadline.complete && (
                        <Text className="font-bold">
                          {` (${getDaysUntilDeadline()} days left)`}
                        </Text>
                      )}
                    </>
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    </>
  );
};

export default DeadlineItem;
