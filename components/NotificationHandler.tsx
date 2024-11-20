import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/libs/supabase";
import {
  showNotification,
  subscribeToNotifications,
} from "@/utils/notifications";
import { checkPlayServices } from "@/libs/push-notifications";
import messaging from "@react-native-firebase/messaging";

// Configure Expo notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function NotificationHandler() {
  const { user, isLoading } = useUserContext();
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    async function setupPushNotifications() {
      try {
        const hasPlayServices = await checkPlayServices();
        console.log("Has Play Services:", hasPlayServices);

        if (hasPlayServices) {
          // Setup Firebase
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            const fcmToken = await messaging().getToken();
            if (fcmToken && user?.id) {
              console.log("FCM Token:", fcmToken);
              await supabase
                .from("users")
                .update({ fcm_token: fcmToken })
                .eq("id", user.id);

              // Set up Firebase message handler
              messaging().onMessage(async (remoteMessage) => {
                console.log("Received foreground message:", remoteMessage);
                showNotification(
                  remoteMessage.notification?.title || "New Message",
                  remoteMessage.notification?.body || ""
                );
              });

              // Handle background messages
              messaging().setBackgroundMessageHandler(async (remoteMessage) => {
                console.log("Received background message:", remoteMessage);
                return Promise.resolve();
              });
            }
          }
        } else {
          console.log("Falling back to Expo notifications");
          // Set up Android channel for Expo notifications
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

          // Request permission and get Expo token
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === "granted") {
            const expoPushToken = await Notifications.getExpoPushTokenAsync({
              projectId: "your-expo-project-id", // Add your Expo project ID here
            });

            if (expoPushToken.data && user?.id) {
              console.log("Expo Push Token:", expoPushToken.data);
              await supabase
                .from("users")
                .update({ expo_push_token: expoPushToken.data })
                .eq("id", user.id);
            }

            // Set up notification handler
            const subscription = Notifications.addNotificationReceivedListener(
              (notification) => {
                console.log("Notification received:", notification);
              }
            );

            subscriptionRef.current = subscription;
          }
        }
      } catch (error) {
        console.error("Push notification setup error:", error);
      }
    }

    if (user && !isLoading) {
      setupPushNotifications();
    }

    return () => {
      if (subscriptionRef.current) {
        Notifications.removeNotificationSubscription(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user, isLoading]);

  return null;
}
