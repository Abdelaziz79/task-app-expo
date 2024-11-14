import React from "react";
import { Text, View } from "react-native";

const Header = ({
  title,
  description,
  icon,
  iconColor = "text-gray-400",
  titleColor = "text-white",
  descriptionColor = "text-gray-400",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor?: string;
  titleColor?: string;
  descriptionColor?: string;
}) => {
  return (
    <View className="px-4 py-6 rounded-lg bg-gray-800/50 mb-6">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className={`${descriptionColor} text-sm font-medium`}>
            {description}
          </Text>
          <Text className={`${titleColor} text-2xl font-bold mt-1`}>
            {title}
          </Text>
        </View>
        {icon && <View className={`${iconColor}`}>{icon}</View>}
      </View>
    </View>
  );
};

export default Header;
