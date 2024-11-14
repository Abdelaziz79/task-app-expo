import { useUserContext } from "@/contexts/UserContext";
import { markNotificationAsRead } from "@/libs/supabase";
import { subscribeToNotifications } from "@/utils/notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

// At the top of your file, add this configuration
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
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      if (!user || isLoading) return;

      try {
        // Set up Android channel with more noticeable settings
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: "notification.wav",
            enableVibrate: true,
            showBadge: true,
          });
        }

        // Request permissions
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert(
            "Permission Required",
            "Push notifications are required to receive task updates.",
            [{ text: "OK" }]
          );
          return;
        }

        setPermissionGranted(true);
        console.log("Notification permissions granted");

        // Add foreground notification handler
        const foregroundSubscription =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log("Received foreground notification:", notification);
            // You can show an in-app notification here if desired
          });

        // Clean up any existing subscription
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        // Set up new subscription
        subscriptionRef.current = subscribeToNotifications(user.id);

        return () => {
          foregroundSubscription.remove();
        };
      } catch (error) {
        console.error("Error setting up notifications:", error);
        Alert.alert(
          "Notification Error",
          "There was an error setting up notifications. Please try again."
        );
      }
    }

    setupNotifications();

    return () => {
      if (subscriptionRef.current) {
        console.log("Cleaning up notification subscription");
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user, isLoading]);

  // Update the notification response handler
  useEffect(() => {
    if (!permissionGranted || !user) return;

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log("Notification response:", response);

          // Extract notification ID and mark as read
          const notificationId =
            response.notification.request.content.data?.notificationId;
          if (notificationId) {
            try {
              // Add your function to mark notification as read
              await markNotificationAsRead(notificationId);
            } catch (error) {
              console.error("Error marking notification as read:", error);
            }
          }
        }
      );

    return () => {
      responseListener.remove();
    };
  }, [permissionGranted, user]);

  return null;
}
