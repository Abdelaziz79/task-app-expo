import Spinner from "@/components/Spinner";
import images from "@/constants/constant";
import { useUserContext } from "@/contexts/UserContext";
import { getUserByEmail } from "@/libs/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, isLoggedIn, setIsLoggedIn, isLoading, user } =
    useUserContext();
  const [loggingIn, setLoggingIn] = useState(false);

  const [security, setSecurity] = useState(true);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      if (user?.role === "superAdmin") {
        router.replace("/home");
      } else {
        router.replace("/tasks");
      }
    }
  }, [isLoading, isLoggedIn]);

  const handleSignIn = async () => {
    if (email === "" || password === "") {
      Toast.show({
        type: "errorDark",
        text1: "Please enter email and password",
      });
      return;
    }
    try {
      setLoggingIn(true);
      const user = await getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        Toast.show({
          type: "errorDark",
          text1: "User not found",
        });
        return;
      }
      if (user.password !== password) {
        Toast.show({
          type: "errorDark",
          text1: "Invalid email or password",
        });
        return;
      }
      await AsyncStorage.setItem("userEmail", email.toLowerCase().trim());
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsLoggedIn(true);
      if (user.role === "superAdmin") {
        router.replace("/home");
      } else {
        router.replace("/tasks");
      }
      Toast.show({
        type: "successDark",
        text1: "Sign in successful",
        text2: "Welcome back",
      });
    } catch (error) {
      Toast.show({
        type: "errorDark",
        text1: "Something went wrong",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView>
        <View className="mt-14 flex-1 justify-center px-8">
          {/* Logo and Header Section */}
          <View className="items-center mb-10">
            <Image source={images.logo} className="w-44 h-44 mb-4" />
            <Text className="text-green-500 text-3xl font-bold mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-400 text-center">
              Sign in to continue
            </Text>
          </View>

          {/* Login Form Section */}
          <View className="space-y-4 ">
            <View className="bg-gray-800 rounded-lg p-4 border border-gray-700 my-2">
              <Text className="text-gray-400 mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                placeholderTextColor="#6B7280"
                className="text-white"
                keyboardType="email-address"
              />
            </View>

            <View className="bg-gray-800 rounded-lg p-4 border border-gray-700 my-2">
              <Text className="text-gray-400 mb-2">Password</Text>
              <View className="flex-row items-center justify-between">
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={security}
                  className="text-white w-[80%]"
                />
                <TouchableOpacity
                  onPress={() => setSecurity(!security)}
                  className=""
                >
                  {security ? (
                    <Eye size={20} color={"#6B7280"} className="" />
                  ) : (
                    <EyeOff size={20} color={"#6B7280"} className="" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignIn}
              className="bg-green-600 p-4 rounded-lg mt-6"
              disabled={loggingIn}
            >
              {loggingIn ? (
                <Spinner size="small" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

// TODO: add notification when user add task or finish task
// TODO: minimize the request to supabase

// DONE: add charts in home page
// DONE: enhance styling (team page, user box, task card)
// DONE: add camera button to create user
// DONE: user box team names not styled good and user page team names not styled good and need refresh control
// DONE: add user button in teams
