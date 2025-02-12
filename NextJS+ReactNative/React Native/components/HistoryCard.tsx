import { View, Text, Image } from "react-native";
import { HistoryCardProps } from "@/types/type";
import { images } from "@/constant";

function HistoryCard({ history }: HistoryCardProps) {
  // Calculate payment fee (Stripe fee 2.9% + R5.43)
  const donationAmount = parseFloat(history.amount); // This is the total charged (e.g. R108)
  const actualDonation = (donationAmount - 5.43) / (1 + 0.029); // Remove the fixed fee first, then divide by (1 + fee percentage)
  const processingFee = (donationAmount - actualDonation).toFixed(2);
  const totalAmount = donationAmount;

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
    <View className="bg-main-secondarybg rounded-3xl p-6 mt-5 mb-6">
      {/* Success Header */}
      <View className="items-center mb-6">
        <View className="w-10 h-10 rounded-full items-center justify-center mb-2">
          <Image source={images.checked} className="w-9 h-9" />
        </View>
        <Text className="text-white text-lg font-JakartaExtraBold">
          Payment Success
        </Text>
      </View>

      {/* Receipt Details */}
      <View className="space-y-4">
        {/* Reference Number */}
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-JakartaBold">
            Reference number
          </Text>
          <Text className="text-white">{history.id}</Text>
        </View>

        {/* Date & Time */}
        <View className="flex-row justify-between ">
          <Text className="text-gray-400 font-JakartaBold">Date & time</Text>
          <Text className="text-white">{formatDate(history.date)}</Text>
        </View>

        {/* Payment Method */}
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-JakartaBold">Payment method</Text>
          <Image source={images.creditcard} className="w-8 h-8" />
        </View>

        {/* Divider */}
        <View className="border-t border-gray-700 my-2" />

        {/* Donation Amount */}
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-JakartaBold">
            Donation Amount
          </Text>
          <Text className="text-white">R {actualDonation.toFixed(2)}</Text>
        </View>

        {/* Processing Fee */}
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-JakartaBold">
            Processing Fee (2.9% + R5.43)
          </Text>
          <Text className="text-white">R {processingFee}</Text>
        </View>

        {/* Total */}
        <View className="flex-row justify-between">
          <Text className="text-gray-400 font-JakartaBold">Total Paid</Text>
          <Text className="text-white text-lg font-semibold">
            R {totalAmount}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default HistoryCard;
