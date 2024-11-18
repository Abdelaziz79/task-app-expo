import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import "@/app/global.css";
import { NotificationHandler } from "@/components/NotificationHandler";
import { toastConfig } from "@/components/ToastComps";
import { UserProvider } from "@/contexts/UserContext";
import { StatusBar } from "expo-status-bar";

// Disable console.logs in production
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Wrap in try-catch to ensure splash screen is hidden
    try {
      SplashScreen.hideAsync();
    } catch (e) {
      // Ignore any errors
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <NotificationHandler />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="team/[name]" options={{ headerShown: false }} />
          <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="(tasks)" options={{ headerShown: false }} />
          <Stack.Screen name="task/[state]" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} visibilityTime={2000} />
        <StatusBar backgroundColor="#161622" style="light" />
      </UserProvider>
    </GestureHandlerRootView>
  );
}
