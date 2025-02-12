import { Image, Text, TouchableOpacity, View } from "react-native";
import { Organisation } from "@/types/type";
import { images } from "@/constant";
import * as Linking from "expo-linking";

const trimLocation = (address: string) => {
  // Trims the address to show only the city and province/state, if possible.
  const parts = address.split(",");
  return parts.slice(0, 2).join(", ");
};

// Props for Org Card
type OrgCardProps = {
  org: Organisation;
  onPress: () => void;
};

const OrgCard = ({ org, onPress }: OrgCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-col bg-main-secondarybg rounded-lg shadow-lg  mb-5 p-4"
  >
    <View className="flex flex-row items-center mb-4">
      <Image
        source={{ uri: org.profile_image_url }}
        className="w-20 h-20 rounded-full mr-4"
        defaultSource={images.picture}
      />

      <View className="flex-1">
        <Text className="text-lg font-JakartaBold text-white" numberOfLines={1}>
          {org.name}
        </Text>
        <Text
          className="text-sm font-JakartaMedium text-gray-300"
          numberOfLines={2}
        >
          {org.description}
        </Text>
      </View>
    </View>

    <View className="bg-card-description rounded-md p-3 mb-4">
      <View className="flex flex-row items-center justify-start mb-3">
        <Image source={images.location} className="w-5 h-5" />
        <Text className="text-sm font-JakartaBold text-gray-300 mb-1 ml-2">
          {trimLocation(org.address)}
        </Text>
      </View>

      <TouchableOpacity
        className="flex flex-col"
        onPress={() => Linking.openURL(org.website)}
      >
        <View className="flex flex-row items-center justify-start mb-2 ">
          <Image source={images.website} className="w-5 h-5" />
          <Text className="text-md font-JakartaBold text-blue-500 underline ml-2">
            {org.website}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="flex flex-row justify-end gap-x-4 mt-2">
        <TouchableOpacity onPress={() => Linking.openURL("")}>
          <Image
            className="w-8 h-8"
            resizeMode="contain"
            source={images.facebook}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("")}>
          <Image
            className="w-8 h-8"
            resizeMode="contain"
            source={images.instagram}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("")}>
          <Image
            className="w-8 h-8"
            resizeMode="contain"
            source={images.tiktok}
          />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

export default OrgCard;
