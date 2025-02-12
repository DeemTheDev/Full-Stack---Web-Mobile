import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useOrganisationStore } from "@/store/useOrganisationStore";
import { images as imageIcons, icons } from "@/constant";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import Carousel from "react-native-reanimated-carousel";
import { useEffect, useState } from "react";
import ReactNativeModal from "react-native-modal";
import { useUser } from "@clerk/clerk-expo";
import Payment from "@/components/Payment";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { StripeProvider } from "@stripe/stripe-react-native";
import { SocialLinks } from "@/types/type";
import { useFetch } from "@/lib/fetch";
import Blog from "../../components/Blog";

// This is the default configuration for image slider
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
// Create a separate ImageSlide component to handle individual image loading
const ImageSlide = ({ imageUrl }: { imageUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View className="relative w-full h-full bg-card-description rounded-lg overflow-hidden">
      {isLoading && (
        <View className="absolute inset-0 flex flex-row items-center justify-center ml-[47%] mt-[20%]">
          <ActivityIndicator size="large" color="#4285F4" style="" />
        </View>
      )}

      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        defaultSource={imageIcons.picture}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        resizeMode="cover"
      />

      {hasError && (
        <View className="absolute inset-0 flex items-center justify-center bg-main-secondarybg">
          <Image
            source={imageIcons.picture}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <Text className="text-white text-sm mt-2">Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

// Organisation Profile Export
const organisationProfile = () => {
  // Get the selected organization from Zustand store
  const selectedOrg = useOrganisationStore((state) => state.selectedOrg);
  const width = Dimensions.get("window").width;
  const { user } = useUser();

  // Track states of images loading into galllery
  const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
  const [profileImageError, setProfileImageError] = useState(false);

  // Payment Modal States
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  const [donationAmount, setDonationAmount] = useState("");

  // States for Stripe fee calculations
  const [processingFee, setProcessingFee] = useState("0.00");
  const [subtotalAmount, setSubtotalAmount] = useState("0.00");

  // Social Links
  const [socials, setSocials] = useState<SocialLinks>();

  // Fetch social links
  const {
    data: socialsResponse,
    loading,
    error,
  } = useFetch<{ data: SocialLinks }>(`/(api)/socials/${selectedOrg?.id}`);

  // Get the social links from the response
  const socialsLinks = socialsResponse?.data;

  // Update the fee calculation when donation amount changes
  useEffect(() => {
    if (donationAmount) {
      const amount = parseFloat(donationAmount);
      if (!isNaN(amount)) {
        // Calculate processing fee (2.9% + R5.43)
        const fee = amount * 0.029 + 5.43;
        const subtotal = amount + fee;

        setProcessingFee(fee.toFixed(2));
        setSubtotalAmount(subtotal.toFixed(2));
      } else {
        setProcessingFee("0.00");
        setSubtotalAmount("0.00");
      }
    } else {
      setProcessingFee("0.00");
      setSubtotalAmount("0.00");
    }
  }, [donationAmount]);

  // Handle back navigation
  const handleBack = () => {
    router.replace("/(root)/(tabs)/home");
  };

  // Handle donation button press
  // Open modal to donate
  const openDonateView = () => {
    setIsPaymentModalVisible(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setDonationAmount("");
    setIsPaymentModalVisible(false);
  };

  // Handle payment processing
  const handlePayment = () => {
    if (donationAmount) {
      console.log("Processing payment:", {
        amount: parseInt(donationAmount),

        organisation: selectedOrg?.name,
      });
      setDonationAmount("");
      handleCloseModal();
    }
  };

  // If no organization is selected, show a message
  if (!selectedOrg) {
    return (
      <SafeAreaView className="bg-main-primarybg h-full">
        <View className="flex-1 justify-center items-center">
          <Image
            source={imageIcons.noResult}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-white text-lg font-JakartaBold mt-4">
            No Organization Selected
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Create an array of images for the carousel
  // Extract image URLs from the images array
  const galleryImages = selectedOrg?.images?.map((img) => img.image_url) || [];

  return (
    <>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        merchantIdentifier="merchant.com.hope"
        urlScheme="myapp"
      >
        <SafeAreaView className="bg-main-primarybg h-full">
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            className="absolute top-[55px] left-3 z-10 w-10 h-10 bg-main-secondarybg rounded-full justify-center items-center"
          >
            <Image
              tintColor="white"
              source={icons.backArrow}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <ScrollView className="flex-1">
            {/* Profile Image with loading state */}
            <View className="relative w-full h-64 bg-main-secondarybg">
              {isProfileImageLoading && (
                <View className="absolute inset-0 flex items-center justify-center">
                  <ActivityIndicator size="large" color="#4285F4" />
                </View>
              )}
              <Image
                source={{ uri: selectedOrg.profile_image_url }}
                className="w-full h-full"
                defaultSource={imageIcons.picture}
                onLoadStart={() => setIsProfileImageLoading(true)}
                onLoadEnd={() => setIsProfileImageLoading(false)}
                onError={() => {
                  setProfileImageError(true);
                  setIsProfileImageLoading(false);
                }}
                resizeMode="cover"
              />
              {profileImageError && (
                <View className="absolute inset-0 flex items-center justify-center bg-main-secondarybg">
                  <Image
                    source={imageIcons.picture}
                    className="w-20 h-20"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-sm mt-2">
                    Failed to load profile image
                  </Text>
                </View>
              )}
            </View>

            {/* Organization Name and Action Buttons */}
            <View className="px-5 mb-8">
              <View className="mt-6">
                <Text className="text-3xl font-JakartaExtraBold text-white">
                  {selectedOrg.name}
                </Text>
              </View>

              {/* Action Buttons Row */}
              <View className="flex-row justify-between items-center mt-4">
                {/* Donate Button */}
                <TouchableOpacity
                  onPress={openDonateView}
                  className="bg-main-lightButton px-5 py-3 rounded-lg flex flex-row items-center "
                >
                  <Text className="text-gray-200 font-JakartaExtraBold text-xl mr-5">
                    DONATE
                  </Text>
                  <Image
                    source={imageIcons.donate}
                    className="w-7 h-7 mr-2 mt-1"
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* Social Media Links */}
                <View className="flex-row items-center justify-end gap-x-4">
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`${socialsLinks?.facebook_url}`)
                    }
                  >
                    <Image
                      className="w-8 h-8"
                      resizeMode="contain"
                      source={imageIcons.facebook}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`${socialsLinks?.instagram_url}`)
                    }
                  >
                    <Image
                      className="w-8 h-8"
                      resizeMode="contain"
                      source={imageIcons.instagram}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`${socialsLinks?.twitter_url}`)
                    }
                  >
                    <Image
                      className="w-8 h-8"
                      resizeMode="contain"
                      source={imageIcons.tiktok}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Organization Details */}
              <View className="mt-6 bg-main-secondarybg rounded-lg p-4">
                <Text className="text-xl font-JakartaBold text-white mb-2">
                  About Organizations
                </Text>
                <Text className="text-gray-300 font-JakartaMedium mb-4">
                  {selectedOrg.description}
                </Text>

                {/* Contact Information */}
                <View className="mt-4 ">
                  <Text className="text-xl font-JakartaBold text-white mb-2">
                    Contact Information
                  </Text>

                  {/* Email */}
                  <View className="flex-row items-center mb-2 mt-2">
                    <Image
                      source={icons.email}
                      className="w-5 h-5 mr-2"
                      resizeMode="contain"
                    />
                    <Text className="text-gray-300 font-JakartaMedium">
                      {selectedOrg.email}
                    </Text>
                  </View>

                  {/* Website */}
                  <TouchableOpacity
                    className="flex-row items-center mb-2 mt-2"
                    onPress={() => Linking.openURL(selectedOrg.website)}
                  >
                    <Image
                      tintColor="gray"
                      source={icons.search}
                      className="w-5 h-5 mr-2"
                      resizeMode="contain"
                    />
                    <Text className="text-blue-400 font-JakartaMedium underline">
                      {selectedOrg.website}
                    </Text>
                  </TouchableOpacity>

                  {/* Location */}
                  <View className="flex-row items-center mt-2">
                    <Image
                      tintColor="gray"
                      source={icons.map}
                      className="w-5 h-5 mr-2"
                      resizeMode="contain"
                    />
                    <Text className="text-gray-300 font-JakartaMedium">
                      {selectedOrg.address}
                    </Text>
                  </View>

                  {/**Verification Label */}
                  <View className="flex-row items-center mt-2">
                    <Image
                      source={imageIcons.verified}
                      className="w-5 h-5 mr-2"
                      resizeMode="contain"
                    />
                    <Text className="text-gray-300 font-JakartaMedium">
                      Verified
                    </Text>
                  </View>
                </View>
              </View>

              {/**Image Slider */}
              {galleryImages.length > 0 && (
                <View className="mt-6">
                  <Text className="text-2xl font-JakartaBold text-white mb-4">
                    Image Gallery
                  </Text>
                  <View className="w-full h-48 bg-main-secondarybg rounded-lg overflow-hidden">
                    <Carousel
                      loop
                      width={width - 40}
                      height={192}
                      autoPlay={true}
                      data={galleryImages}
                      scrollAnimationDuration={1000}
                      renderItem={({ item }) => <ImageSlide imageUrl={item} />}
                      defaultIndex={0}
                    />
                  </View>
                </View>
              )}
            </View>
            <View>
              <Blog id={`${selectedOrg.id}`} />
            </View>
            {/* Payment Modal */}
            <View>
              <ReactNativeModal
                isVisible={isPaymentModalVisible}
                onBackdropPress={handleCloseModal}
                onBackButtonPress={handleCloseModal}
                swipeDirection={["down"]}
                onSwipeComplete={handleCloseModal}
                useNativeDriver={true}
                propagateSwipe={true}
                style={{
                  margin: 0,
                  justifyContent: "flex-end",
                  position: "relative",
                }}
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  style={{ width: "100%" }}
                >
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="bg-main-primarybg rounded-t-3xl relative w-full">
                      {/* Swipe Indicator */}
                      <View className="items-center pt-2">
                        <View className="w-10 h-1 bg-gray-600 rounded-full" />
                      </View>

                      {/* Header */}
                      <View className="p-6 border-b border-gray-800 flex-row justify-between items-center">
                        <View>
                          <Text className="text-2xl font-JakartaBold text-white mb-1">
                            Donate to {selectedOrg?.name}
                          </Text>
                          <Text className="text-gray-400 font-JakartaMedium">
                            Make a difference today
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          className="w-8 h-8 bg-card-description rounded-full items-center justify-center"
                        >
                          <Image
                            source={icons.close}
                            className="w-4 h-4"
                            tintColor="white"
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Content */}
                      <View className="p-6">
                        {/* Amount Input Section */}
                        <View className="mb-6">
                          <Text className="text-gray-400 font-JakartaMedium mb-3">
                            Enter Donation Amount
                          </Text>
                          <View className="flex-row items-center">
                            <View className="bg-main-lightButton px-4 py-4 rounded-l-xl">
                              <Text className="text-white font-JakartaBold text-xl">
                                R
                              </Text>
                            </View>
                            <TextInput
                              className="flex-1 bg-card-description px-4 py-4 rounded-r-xl text-white font-JakartaBold text-xl"
                              placeholder="0.00"
                              placeholderTextColor="#666"
                              keyboardType="numeric"
                              value={donationAmount}
                              onChangeText={setDonationAmount}
                            />
                          </View>
                        </View>

                        {/* Fee Breakdown Section */}
                        <View className="space-y-3 mb-6">
                          <Text className="text-gray-400 font-JakartaMedium mb-3">
                            Fee Breakdown
                          </Text>

                          {/* Processing Fee Display */}
                          <View className="flex-row items-center justify-between bg-card-description p-4 rounded-xl">
                            <Text className="text-gray-300 font-JakartaMedium">
                              Processing Fee (2.9% + R5.43)
                            </Text>
                            <Text className="text-white font-JakartaBold">
                              R {processingFee}
                            </Text>
                          </View>

                          {/* Subtotal Display */}
                          <View className="flex-row items-center justify-between bg-card-description p-4 rounded-xl">
                            <Text className="text-gray-300 font-JakartaMedium">
                              Total Amount (inc. fees)
                            </Text>
                            <Text className="text-white font-JakartaBold">
                              R {subtotalAmount}
                            </Text>
                          </View>
                        </View>

                        {/* Payment Button */}
                        <Payment
                          fullName={user?.fullName!}
                          email={user?.emailAddresses[0].emailAddress!}
                          amount={subtotalAmount}
                          organisationId={selectedOrg.id}
                          onPress={handlePayment}
                        />

                        <TouchableOpacity
                          onPress={handleCloseModal}
                          className="p-4"
                        >
                          <Text className="text-gray-400 font-JakartaMedium text-center">
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Note */}
                      <Text className="text-gray-400 text-sm text-center pb-6 px-6">
                        Your donation will directly support {selectedOrg?.name}
                        's mission.
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
              </ReactNativeModal>
            </View>
          </ScrollView>
        </SafeAreaView>
      </StripeProvider>
    </>
  );
};

export default organisationProfile;
