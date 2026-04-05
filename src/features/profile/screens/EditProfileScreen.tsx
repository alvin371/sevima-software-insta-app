import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeScreen } from "@/shared/components/ui/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import { useMe } from "@/features/auth/hooks/useMe";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";

export function EditProfileScreen() {
  const navigation = useNavigation();
  const meQuery = useMe();
  const updateProfileMutation = useUpdateProfile();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!meQuery.data) return;

    setFullName(meQuery.data.fullName);
    setUsername(meQuery.data.username);
    setBio(meQuery.data.bio ?? "");
    setWebsite(meQuery.data.website ?? "");
  }, [meQuery.data]);

  const handleSubmit = () => {
    updateProfileMutation.mutate(
      {
        fullName,
        username,
        bio: bio || undefined,
        website: website || undefined,
      },
      {
        onSuccess: () => navigation.goBack(),
      },
    );
  };

  if (meQuery.isLoading) {
    return (
      <SafeScreen>
        <LoadingSpinner fullScreen />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-brand-dark">Edit Profile</Text>
        <TouchableOpacity disabled={updateProfileMutation.isPending} onPress={handleSubmit}>
          <Text className="text-brand-primary font-semibold text-base">Done</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 px-4 pt-6">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-gray-200 mb-2" />
          <Text className="text-brand-primary text-sm font-semibold">Change photo</Text>
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-1">Full Name</Text>
          <TextInput
            className="border-b border-gray-200 pb-2 text-base text-brand-dark"
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-1">Username</Text>
          <TextInput
            className="border-b border-gray-200 pb-2 text-base text-brand-dark"
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-1">Bio</Text>
          <TextInput
            className="border-b border-gray-200 pb-2 text-base text-brand-dark"
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <View className="mb-4">
          <Text className="text-xs text-gray-500 mb-1">Website</Text>
          <TextInput
            className="border-b border-gray-200 pb-2 text-base text-brand-dark"
            placeholder="Website"
            autoCapitalize="none"
            value={website}
            onChangeText={setWebsite}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
