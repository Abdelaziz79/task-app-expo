import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import "@/app/global.css";
import { NotificationHandler } from "@/components/NotificationHandler";
import { toastConfig } from "@/components/ToastComps";
import { UserProvider } from "@/contexts/UserContext";
import { StatusBar } from "expo-status-bar";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <UserProvider>
        <NotificationHandler />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="team/[name]" options={{ headerShown: false }} />
          <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="(tasks)" options={{ headerShown: false }} />
          <Stack.Screen name="task/[state]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar backgroundColor="#161622" style="light" />
        <Toast config={toastConfig} visibilityTime={2000} />
      </UserProvider>
    </>
  );
}
