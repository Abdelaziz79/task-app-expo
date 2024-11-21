import React from "react";
import { TouchableOpacity } from "react-native";

const StyledButton = ({
  children,
  onPress,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      className="p-4 border border-green-500/30 rounded-xl items-center flex-row justify-center"
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

export default StyledButton;
