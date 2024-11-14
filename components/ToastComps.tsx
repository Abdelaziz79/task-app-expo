import { CheckCircle, Info, XCircle } from "lucide-react-native";
import { Text, View } from "react-native";

export function SuccessDarkComponent({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) {
  return (
    <View className="min-h-[72px] w-11/12 bg-gray-800/95 rounded-xl border-l-4 border-green-500 px-5 py-4 shadow-2xl mx-4 flex-row items-center">
      <View className="mr-3">
        <CheckCircle size={24} color="#22c55e" />
      </View>
      <View className="flex-1">
        <Text className="text-green-400 font-bold text-base tracking-wide">
          {text1}
        </Text>
        {text2 && (
          <Text className="text-gray-400 text-sm mt-1.5 leading-5">
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
}

export function ErrorDarkComponent({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) {
  return (
    <View className="min-h-[72px] w-11/12 bg-gray-800/95 rounded-xl border-l-4 border-red-500 px-5 py-4 shadow-2xl mx-4 flex-row items-center">
      <View className="mr-3">
        <XCircle size={24} color="#ef4444" />
      </View>
      <View className="flex-1">
        <Text className="text-red-400 font-bold text-base tracking-wide">
          {text1}
        </Text>
        {text2 && (
          <Text className="text-gray-400 text-sm mt-1.5 leading-5">
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
}

export function InfoDarkComponent({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) {
  return (
    <View className="min-h-[72px] w-11/12 bg-gray-800/95 rounded-xl border-l-4 border-blue-500 px-5 py-4 shadow-2xl mx-4 flex-row items-center">
      <View className="mr-3">
        <Info size={24} color="#2563eb" />
      </View>
      <View className="flex-1">
        <Text className="text-blue-400 font-bold text-base tracking-wide">
          {text1}
        </Text>
      </View>
    </View>
  );
}

export const toastConfig = {
  successDark: SuccessDarkComponent,
  errorDark: ErrorDarkComponent,
  infoDark: InfoDarkComponent,
};
