import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { icons, images } from "@/constant";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import InputField from "../../components/InputField";
import OAuth from "@/components/OAuth";

// Clerk packages for signing up
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  // Modal states
  // Switch between success and verification modal

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**Form handling with Clerk provider for authentication  */

  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Clerk sign up authentication

  // Verify user login with email
  const [verification, setVerification] = useState({
    state: "default", // Verification state before success
    error: "", // Error message for user
    code: "", // Email verification code
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email, // Form email
        password: form.password, // Form password
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // set verification status
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // If error consist console log it:
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return; // If verification process fails:  return nothing...

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If sign up process is successful

      if (completeSignUp.status === "complete") {
        // If sign up sucess
        // Create user in the database
        // TO DO:

        // fetchAPI coming from lib/fetch.ts
        // Uses user+api route to insert into neon database.
        await fetchAPI("/(api)/user", {
          method: "POST",

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });

        await setActive({ session: completeSignUp.createdSessionId });
        // Modify verification state to complete: To go to home page
        setVerification({
          ...verification, // Spreads all properties
          state: "success",
        });
      } else {
        // If verification is not comepleted: set state to failed
        setVerification({
          ...verification, // Spreads all properties
          error: "Verification failed.",
          state: "failed",
        });
      }

      // Final catch statment
    } catch (err: any) {
      setVerification({
        ...verification, // Spreads all properties
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-main-primarybg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-4">
            {/* Header */}
            <Text className="text-3xl font-JakartaExtraBold text-center text-white mb-12 mt-8">
              Create Account
            </Text>

            {/* Curved Background Container */}
            <View className="bg-main-secondarybg w-full rounded-t-3xl px-4 py-8 flex-1">
              {/* Form Fields */}
              <View className="space-y-4">
                <View>
                  <InputField
                    icon={icons.person}
                    label="Full Name"
                    placeholder="Full Name"
                    value={form.name}
                    onChangeText={(value) => setForm({ ...form, name: value })}
                  />
                </View>

                <View>
                  <InputField
                    icon={icons.email}
                    label="Email"
                    placeholder="Example@email.com"
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, email: value })}
                  />
                </View>

                <View>
                  <InputField
                    icon={icons.lock}
                    label="Password"
                    placeholder="••••••••"
                    value={form.password}
                    onChangeText={(value) =>
                      setForm({ ...form, password: value })
                    }
                    secureTextEntry={true}
                  />
                </View>
              </View>

              {/* Terms and Sign Up Button */}
              <View className="mt-8">
                <Text className="text-white/60 text-center text-sm mb-4">
                  By continuing, you agree to our{" "}
                  <Text className="text-white font-bold">Terms of Use</Text> and{" "}
                  <Text className="text-white font-bold">Privacy Policy</Text>.
                </Text>

                <CustomButton
                  title="Sign Up"
                  className="py-4 rounded-lg "
                  onPress={onSignUpPress}
                  bgVariant="success"
                />
              </View>

              {/** OAuth class in /components for handling authentication and email verification */}
              {/** OAuth class */}

              <OAuth />

              {/* Login Link */}
              <View className="flex-row justify-center mt-6 mb-4 ">
                <Text className="text-white/60">Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/sign-in")}
                >
                  <Text className="text-emerald-400 font-bold">Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/** Modal for PENDING  */}

          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") setShowSuccessModal(true);
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-2xl font-JakartaExtraBold mb-2 ">
                Verification
              </Text>

              <Text className="font-Jakarta mb-5">
                We've sent a verification code to: {form.email}
              </Text>

              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="00000"
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerification({
                    ...verification,
                    code,
                  })
                }
              />

              {/** If verification error:  */}
              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}

              <CustomButton
                title="Verify Email"
                onPress={onPressVerify}
                textVariant="success"
                className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>

          {/** Modal for SUCCESS  */}

          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center ">
                Verified
              </Text>

              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2 ">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Browse Home"
                bgVariant="success"
                className="mt-5 bg-success-500"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push("/(root)/(tabs)/home");
                }}
              />
            </View>
          </ReactNativeModal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
