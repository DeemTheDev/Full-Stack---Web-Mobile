import OrgCard from "@/components/OrgCard";
import { icons, images } from "@/constant";
import { useFetch } from "@/lib/fetch";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { Organisation } from "@/types/type";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

// Zustand management for organisations
import { useOrganisationStore } from "@/store/useOrganisationStore";
import { router } from "expo-router";
import React from "react";

const home = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true); // Track loading state

  // Clerk sign out hook
  const { signOut } = useAuth();

  // Zustand: set all organisations from the database
  const setOrganisations = useOrganisationStore(
    (state) => state.setOrganizations
  );

  // Zustand: sets a clicked Organisation
  const setSelectedOrg = useOrganisationStore((state) => state.setSelectedOrg);

  // Function to log out the user
  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  // Fetch organisation data from the database
  const { data: response, error } = useFetch<{ data: Organisation[] }>(
    "/(api)/organisation"
  );

  // Store organisation data from database into Zustand state
  const organisations = response?.data;

  // Set loading state based on data fetching status
  useEffect(() => {
    if (response || error) {
      setLoading(false); // Stop loading when data or error is available
    }
    if (organisations) {
      setOrganisations(organisations);
    }
  }, [response, error, organisations]);

  // On press function when organisation clicked
  const handlePress = (item: Organisation) => {
    setSelectedOrg(item);
    router.replace("/(root)/organisationProfile");
  };

  return (
    <SafeAreaView className="bg-main-primarybg h-full">
      <FlatList
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#000"
                className="w-full h-full"
              />
            ) : (
              <>
                <Image
                  className="w-40 h-40"
                  alt="No recent Organizations Found!"
                  resizeMode="contain"
                  source={images.noResult}
                />
                <Text className="text-sm text-white">
                  No Organizations Found
                </Text>
              </>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold capitalize text-white">
                Welcome,{" "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
                👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-12 h-12 rounded-full"
              >
                <Image
                  className="w-5 h-5"
                  source={icons.out}
                  tintColor="white"
                />
              </TouchableOpacity>
            </View>

            <View className="flex flex-row m-2 justify-start py-2">
              <Text className="text-2xl font-JakartaExtraBold text-white">
                Listed Organisations
              </Text>
            </View>
          </>
        )}
        data={organisations}
        renderItem={({ item }) => (
          <OrgCard org={item} onPress={() => handlePress(item)} />
        )}
      />
    </SafeAreaView>
  );
};
export default home;
