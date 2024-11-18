import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/libs/supabase";
import {
  showNotification,
  subscribeToNotifications,
} from "@/utils/notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export function NotificationHandler() {
  const { user, isLoading } = useUserContext();
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    async function setupNotifications() {
      if (!user || isLoading) {
        // console.log("No user or still loading");
        return;
      }

      // console.log("Setting up notifications for user:", user.id);

      try {
        // Set up Android channel
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            enableVibrate: true,
            showBadge: true,
          });
          // console.log("Android notification channel set up");
        }

        // Request notification permissions
        const { status } = await Notifications.requestPermissionsAsync();
        // console.log("Notification permission status:", status);

        if (status !== "granted") {
          // console.log("Notification permissions not granted");
          return;
        }

        // Set up notification handlers
        const foregroundSubscription =
          Notifications.addNotificationReceivedListener((notification) => {
            // console.log("Received foreground notification:", notification);
          });

        // Clean up existing subscription
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        // Set up Supabase subscription
        subscriptionRef.current = subscribeToNotifications(user.id);
        // console.log("Supabase subscription set up for user:", user.id);

        return () => {
          foregroundSubscription.remove();
        };
      } catch (error) {
        console.error("Error in setupNotifications:", error);
      }
    }

    setupNotifications();
    // testNotifications();
    return () => {
      if (subscriptionRef.current) {
        // console.log("Cleaning up notification subscription");
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user, isLoading]);

  return null;
}
const testNotifications = async () => {
  try {
    // Test 1: Direct notification
    // console.log("Testing direct notification...");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Direct Test",
        body: "This is a direct test notification",
        sound: true,
      },
      trigger: null,
    });

    // Test 2: Through our showNotification function
    // console.log("Testing showNotification function...");
    await showNotification(
      "Function Test",
      "This is a test through our function"
    );

    // Test 3: Simulate a Supabase notification
    // console.log("Testing Supabase notification...");
    await supabase.from("notifications").insert([
      {
        user_id: "YOUR_USER_ID", // Replace with actual user ID
        message: "This is a test notification",
        type: "new_task",
        read: false,
      },
    ]);
  } catch (error) {
    console.error("Test error:", error);
  }
};
