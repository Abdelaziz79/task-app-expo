import React from "react";
import { Text, View } from "react-native";

const StateBox = ({
  title,
  value,
  titleColor = "text-gray-400",
  valueColor = "text-white",
}: {
  title: string;
  value: number;
  titleColor?: string;
  valueColor?: string;
}) => {
  return (
    <View className="bg-gray-800 rounded-xl p-4 flex-1">
      <Text className={` text-sm ${titleColor}`}>{title}</Text>
      <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
    </View>
  );
};

export default StateBox;
