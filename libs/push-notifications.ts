import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";

export async function checkPlayServices() {
  if (Platform.OS === "android") {
    try {
      await messaging().getToken();
      return true;
    } catch (error) {
      console.log("Device might not support Google Services:", error);
      return false;
    }
  }
  return true;
}
