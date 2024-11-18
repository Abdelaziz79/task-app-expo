import { NotificationPayload } from "@/types/types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "../libs/supabase";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export async function showNotification(title: string, body: string) {
  try {
    // console.log("Showing notification:", { title, body });

    // Always request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    // console.log("Permission status:", status);

    if (status !== "granted") {
      // console.log("Notification permission not granted");
      return;
    }

    // Set up Android channel if needed
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        enableVibrate: true,
        showBadge: true,
      });
    }

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Error in showNotification:", error);
    throw error;
  }
}

export function subscribeToNotifications(userId: string) {
  // console.log("=== Setting up notification subscription ===");
  // console.log("User ID:", userId);

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on<NotificationPayload>(
      "postgres_changes",
      {
        event: "INSERT", // Specifically listen for INSERT events
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload: RealtimePostgresChangesPayload<NotificationPayload>) => {
        // console.log("=== Received Supabase Event ===");
        // console.log("Event type:", payload.eventType);
        // console.log("Full payload:", payload);
        if (payload.new) {
          const { type, message } = payload.new as NotificationPayload;
          let title;

          // console.log("Processing notification:", { type, message });

          switch (type) {
            case "new_task":
              title = message.includes("successfully assigned")
                ? "Task Assigned"
                : "New Task";
              break;
            case "completed_task":
              title = message.includes("successfully")
                ? "Task Completed"
                : "Task Update";
              break;
            default:
              title = "Notification";
          }

          showNotification(title, message).catch((error) => {
            console.error("Error showing notification:", error);
          });
        }
      }
    )
    .subscribe((status, err) => {
      if (err) {
        console.error("=== Supabase Subscription Error ===");
        console.error(err);
      } else {
        // console.log("=== Supabase Subscription Status ===");
        // console.log(status);
      }
    });

  return channel;
}

export async function testSupabaseNotification(userId: string) {
  try {
    // console.log("Starting Supabase notification test for user:", userId);

    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: userId,
          message: "This is a test notification from Supabase",
          type: "new_task",
          read: false,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting test notification:", error);
      throw error;
    }

    // console.log("Successfully inserted notification:", data);
    return data;
  } catch (error) {
    console.error("Test notification error:", error);
    throw error;
  }
}

// Update the test button function
