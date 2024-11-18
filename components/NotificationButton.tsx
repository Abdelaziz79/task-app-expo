import { useUserContext } from "@/contexts/UserContext";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/libs/supabase";
import { Ionicons } from "@expo/vector-icons";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

interface Notification {
  id: number;
  message: string;
  created_at: string;
  read: boolean;
  type: "new_task" | "completed_task";
}

export function NotificationButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUserContext();
  const fetchNotifications = async (userId: string) => {
    const notifications = await getNotifications(userId);
    setNotifications(notifications);
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };
  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  const markAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId.toString());
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user?.id || "");

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
          fetchNotifications(user?.id || "");
        }}
        className="relative p-2"
      >
        <Ionicons name="notifications" size={24} color="white" />
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-[20px] justify-center items-center">
            <Text className="text-white text-xs font-bold">{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <GestureHandlerRootView className="flex-1">
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-[#161622] rounded-t-[20px] min-h-[70%] max-h-[90%]">
              <View className="flex-row justify-between items-center p-4 border-b border-[#2A2A3C]">
                <Text className="text-white text-xl font-bold">
                  Notifications
                </Text>
                <View className="flex-row items-center">
                  {unreadCount > 0 && (
                    <TouchableOpacity
                      onPress={markAllAsRead}
                      className="mr-4 flex justify-center items-center"
                    >
                      <Text className="text-blue-500 text-sm px-2 py-1 mx-2 rounded-md bg-[#2A2A3C]">
                        Mark all as read
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="p-1 flex justify-center items-center "
                  >
                    <X size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView className="p-4">
                {notifications.length === 0 ? (
                  <Text className="text-gray-500 text-center mt-5">
                    No notifications
                  </Text>
                ) : (
                  notifications.map((notification) => (
                    <View
                      key={notification.id}
                      className={`
                        flex-row justify-between items-center p-3 rounded-lg mb-2
                        ${notification.read ? "bg-[#1E1E2E]" : "bg-[#2A2A3C]"}
                      `}
                    >
                      <View className="flex-1 mr-2">
                        <Text className="text-white text-sm mb-1">
                          {notification.message}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {formatDate(notification.created_at)}
                        </Text>
                      </View>
                      {!notification.read && (
                        <TouchableOpacity
                          onPress={() => markAsRead(notification.id)}
                          className="bg-blue-500 p-2 rounded"
                        >
                          <Text className="text-white text-sm px-2 py-1 rounded-md bg-[#3f3f5a]">
                            Mark as read
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}
