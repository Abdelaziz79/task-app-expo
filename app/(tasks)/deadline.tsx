import CreateDeadlineForm from "@/components/CreateDeadlineForm";
import DeadlineItem from "@/components/DeadlineItem";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import StyledButton from "@/components/StyledButton";
import { useUserContext } from "@/contexts/UserContext";
import useRefresh from "@/hooks/useRefresh";
import useSupabase from "@/hooks/useSupabase";
import { getDeadlines } from "@/libs/supabase";
import { Clock, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Deadline = () => {
  const [showForm, setShowForm] = useState(false);
  const { user, isLoading } = useUserContext();
  const {
    data: deadlines,
    isLoading: isLoadingData,
    refetch,
  } = useSupabase<any>(() => getDeadlines(user?.id || ""));
  const { onRefresh, refreshing } = useRefresh(refetch);
  if (isLoading || isLoadingData) return <Loading />;

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-5">
      <Header
        title="Deadlines"
        description="Manage your tasks and deadlines"
        icon={<Clock size={24} color="white" />}
      />
      {/* Add New Deadline Button */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StyledButton onPress={() => setShowForm(!showForm)}>
          {showForm ? (
            <X size={20} color="#4ade80" />
          ) : (
            <Plus size={20} color="#4ade80" />
          )}
          <Text className="text-green-400 font-semibold">
            {showForm ? "Close" : "Add New Deadline"}
          </Text>
        </StyledButton>
        {showForm && (
          <View className="mt-2 ">
            <CreateDeadlineForm user={user} />
          </View>
        )}

        {/* Deadline List */}
        <View className="mt-4">
          {deadlines && deadlines.length > 0 ? (
            deadlines.map((deadline: any) => (
              <DeadlineItem
                refetch={refetch}
                deadline={deadline}
                key={deadline.id}
              />
            ))
          ) : (
            <Text className="text-gray-400 mt-4 text-center">
              No deadlines found 😊
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Deadline;
