import { View, ActivityIndicator } from "react-native";
import React from "react";

interface SpinnerProps {
  size?: "small" | "large";
  color?: string;
}

const Spinner = ({ size = "large", color = "#22c55e" }: SpinnerProps) => {
  return (
    <View className="flex-1 justify-center items-center ">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Spinner;
