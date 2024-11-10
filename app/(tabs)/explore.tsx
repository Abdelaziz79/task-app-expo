import { Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="mt-10 mb-7">
        <Text className="text-center text-2xl text-white">
          Welcome! Abdelaziz 👋
        </Text>
      </View>
    </SafeAreaView>
  );
}
