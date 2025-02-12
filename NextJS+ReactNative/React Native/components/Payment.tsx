import { Alert, Text, TouchableOpacity, View, Image } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { PaymentProps } from "@/types/type";
import ReactNativeModal from "react-native-modal";
import { images } from "@/constant";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const Payment = ({
  fullName,
  email,
  amount,
  organisationId,
  onPress,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);
  const { user } = useUser();

  // Initialize payment sheet and handle payment
  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error Code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
      await createDonationRecord();
    }
  };

  // Create donation record in database
  const createDonationRecord = async () => {
    try {
      // Create the data object first
      const donationData = {
        amount: parseFloat(amount!),
        donation_date: new Date().toISOString().split("T")[0],
        organisation_id: organisationId!,
        donor_id: user?.id,
      };

      // Log the data before sending
      console.log("Donation data being sent:", donationData);

      // Insert donation record into database
      const response = await fetchAPI("/(api)/donations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error recording donation:", error);

      Alert.alert(`Error: ${error}`);
    }
  };

  // Initialize the payment sheet using Stripe's recommended implementation
  // Changes made to fix endless processing:
  // 1. Removed custom confirmHandler - using Stripe's automatic confirmation
  // 2. Using server-provided ephemeralKey and clientSecret directly
  // 3. Added proper customer billing details
  // 4. Removed custom payment processing logic that was causing the loop
  const initializePaymentSheet = async () => {
    try {
      // Get payment intent and customer details from server
      const { paymentIntent, ephemeralKey, customer } = await fetchAPI(
        "/(api)/(stripe)/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName || email.split("@")[0],
            email: email,
            amount: amount,
          }),
        }
      );

      // Initialize payment sheet with server-provided details
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Hope, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey.secret,
        paymentIntentClientSecret: paymentIntent.client_secret,
        defaultBillingDetails: {
          name: fullName || email.split("@")[0],
          email: email,
        },
        returnURL: "myapp://donate",
      });

      if (error) {
        console.error("Payment sheet init error:", error);
        Alert.alert("Error initializing payment");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error processing payment");
    }
  };

  return (
    <>
      <TouchableOpacity
        className="py-4 bg-emerald-400 rounded-xl shadow-lg active:bg-emerald-500 mb-4 px-8 transform active:scale-95 transition-transform border border-emerald-300 relative overflow-hidden group"
        onPress={openPaymentSheet}
      >
        <Text className="text-white font-JakartaBold text-lg text-center tracking-wide relative z-10">
          Donate
        </Text>
        <View className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </TouchableOpacity>

      <ReactNativeModal
        isVisible={success}
        onBackButtonPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />
          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Donation placed successfully
          </Text>
          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you, your generous donation has been successfully placed.
            Please proceed to view on your profile.
          </Text>
          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
            bgVariant="success"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
