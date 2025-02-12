import { onboarding } from "@/constant";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import CustomButton from "../../components/CustomButton";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-main-primarybg">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="font-JakartaBold text-md text-white">Skip</Text>
      </TouchableOpacity>

      <View className="flex-1 w-full relative">
        <Swiper
          ref={swiperRef}
          loop={false}
          dot={<View className="w-[32px] h-[4px] mb-20 mx-1 bg-slate-300" />}
          activeDot={
            <View className="w-[32px] h-[4px]  mb-20 mx-1 bg-onboarding-welcome" />
          }
          onIndexChanged={(index) => setActiveIndex(index)}
        >
          {onboarding.map((item) => (
            <>
              <View key={item.id} className="flex items-center justify-center">
                <Text className="font-JakartaExtraBold text-[37px] text-center text-white mt-20 mb-20">
                  {item.title}
                </Text>
              </View>

              <View className="h-full bg-main-secondarybg rounded-t-[50px]">
                <Image
                  source={item.image}
                  className="w-full h-[300px] mt-20"
                  resizeMode="contain"
                />
              </View>
            </>
          ))}
        </Swiper>
        {/* Position the button absolutely */}
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <CustomButton
            title={isLastSlide ? "Get Started" : "Next"}
            onPress={() =>
              isLastSlide
                ? router.replace("/(auth)/sign-up")
                : swiperRef.current?.scrollBy(1)
            }
            className="w-11/12 bg-main-lightButton rounded-lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
