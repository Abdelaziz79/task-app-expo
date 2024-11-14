import React from "react";
import { SafeAreaView } from "react-native";
import Spinner from "./Spinner";

const Loading = () => {
  return (
    <SafeAreaView className="flex-1 p-5 bg-gray-900">
      <Spinner size="large" />
    </SafeAreaView>
  );
};

export default Loading;
