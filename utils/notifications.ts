import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "../libs/supabase";
import Toast from "react-native-toast-message";

// Configure notifications with sound
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// Request permissions
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

// Show local notification
export async function showNotification(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "notification.wav", // Use the sound file name from your config
        priority: "high",
      },
      trigger: null,
    });

    // Also show toast message
    Toast.show({
      type: "success",
      text1: title,
      text2: body,
      position: "top",
    });
  } catch (error) {
    console.error("Error showing notification:", error);
  }
}

// Subscribe to notifications from Supabase
export function subscribeToNotifications(userId: string) {
  console.log("Setting up notification subscription for user:", userId);

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        console.log("Received notification payload:", payload);

        if (payload.new) {
          const { type, message } = payload.new;
          const title = type === "new_task" ? "New Task" : "Task Completed";

          await showNotification(title, message);
        }
      }
    )
    .subscribe((status) => {
      console.log("Supabase subscription status:", status);
    });

  return channel;
}
