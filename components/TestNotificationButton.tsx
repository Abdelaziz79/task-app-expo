import { useUserContext } from "@/contexts/UserContext";
import { testSupabaseNotification } from "@/utils/notifications";
import { Button } from "react-native";

export function TestNotificationButton() {
  const { user } = useUserContext();

  const handleTest = async () => {
    if (!user) {
      //   console.log("No user found");
      return;
    }

    // console.log("=== Starting Notification Test ===");
    // console.log("User ID:", user.id);

    try {
      const result = await testSupabaseNotification(user.id);
      //   console.log("Test result:", result);
    } catch (error) {
      console.error("Test failed:", error);
    }
  };

  return <Button title="Test Notification" onPress={handleTest} />;
}
