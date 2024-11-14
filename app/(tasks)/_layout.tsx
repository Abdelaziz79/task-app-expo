import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { THEME_COLOR } from "@/constants/constant";
import { useUserContext } from "@/contexts/UserContext";

export default function TabLayout() {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME_COLOR,
        tabBarInactiveTintColor: "#666666",
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "#333333",
          paddingBottom: 7,
          paddingTop: 5,
          backgroundColor: "#1f2937",
        },
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "list-sharp" : "list-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="completedTasks"
        options={{
          title: "Completed Tasks",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={
                focused ? "checkmark-circle-sharp" : "checkmark-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="teamScreen"
        options={{
          title: "Teams",
          href:
            user?.role != "admin" && user?.role != "superAdmin"
              ? null
              : undefined,
          tabBarIcon:
            user?.role != "admin" && user?.role != "superAdmin"
              ? () => null
              : ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "people-circle" : "people-circle-outline"}
                    color={color}
                    size={24}
                  />
                ),
        }}
      />
      <Tabs.Screen
        name="sendedTasks"
        options={{
          title: "Sended Tasks",
          href:
            user?.role != "admin" && user?.role != "superAdmin"
              ? null
              : undefined,
          tabBarIcon:
            user?.role != "admin" && user?.role != "superAdmin"
              ? () => null
              : ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "paper-plane-sharp" : "paper-plane-outline"}
                    color={color}
                    size={24}
                  />
                ),
        }}
      />
    </Tabs>
  );
}
