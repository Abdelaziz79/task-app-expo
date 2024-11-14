import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { THEME_COLOR } from "@/constants/constant";

export default function TabLayout() {
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
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Teams",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people-circle" : "people-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="createUser"
        options={{
          title: "Create User",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-add-sharp" : "person-add-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="createTeam"
        options={{
          title: "Create Team",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people-sharp" : "people-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
