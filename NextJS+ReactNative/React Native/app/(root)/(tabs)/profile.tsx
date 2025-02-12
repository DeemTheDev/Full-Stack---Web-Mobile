import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InputField from "@/components/InputField";

const Profile = () => {
  const { user } = useUser();

  // helper function to format Date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-main-primarybg">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl text-white font-JakartaBold my-5">
          My profile
        </Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-main-secondarybg rounded-lg shadow-sm shadow-neutral-400 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="User ID"
              placeholder={user?.id || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="First name"
              placeholder={
                user?.firstName ||
                user?.emailAddresses[0].emailAddress.split("@")[0]
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Created"
              placeholder={formatDate(`${user?.createdAt}`) || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
