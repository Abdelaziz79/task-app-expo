import { Href, Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const LinkComp = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => {
  return (
    <Link href={href as Href<string>} asChild>
      <TouchableOpacity className="bg-gray-800 p-4 rounded-xl flex-row justify-between items-center">
        <View>
          <Text className="text-white text-lg font-semibold">{title}</Text>
          <Text className="text-gray-400 text-sm">{description}</Text>
        </View>
        <Text className="text-white text-xl">→</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default LinkComp;
