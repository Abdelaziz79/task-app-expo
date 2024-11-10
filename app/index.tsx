import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constant/constant";

const Index = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <View>
        <Image source={images.logo} className="w-20 h-20" />
        <Text className="text-white text-2xl font-bold">Index</Text>
      </View>
    </SafeAreaView>
  );
};

export default Index;
