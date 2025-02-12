import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { icons } from "@/constant";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import InputField from "../../components/InputField";
import OAuth from "@/components/OAuth";

// Clerk import
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**Form handling with Clerk provider for authentication  */

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Sign In functionality

  // Clerk Authentication

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      Alert.alert("Login Failed", `Error: ${err} `);
    }
  }, [isLoaded, form.email, form.password]);

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
              Welcome👋
            </Text>

            {/* Curved Background Container */}
            <View className="bg-main-secondarybg w-full rounded-t-3xl px-4 py-8 flex-1">
              {/* Form Fields */}
              <View className="space-y-4">
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
                  title="Sign In"
                  className="py-4 rounded-lg "
                  onPress={onSignInPress}
                  bgVariant="success"
                />
              </View>

              {/** OAuth class in /components for handling authentication and email verification */}
              {/** OAuth class */}

              <OAuth />

              {/* Login Link */}
              <View className="flex-row justify-center mt-6 mb-4 ">
                <Text className="text-white/60">Dont have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/sign-up")}
                >
                  <Text className="text-emerald-400 font-bold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
