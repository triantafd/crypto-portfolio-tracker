import { View, Text, TouchableOpacity } from "react-native";
import { Transaction } from "../store/useStore";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "react-native";

interface TransactionItemProps {
  transaction: Transaction;
  coinName?: string;
  coinSymbol?: string;
  coinImage?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function TransactionItem({
  transaction,
  coinName,
  coinSymbol,
  coinImage,
  onPress,
  onDelete,
}: TransactionItemProps) {
  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isPositive = transaction.type === "buy" || transaction.type === "transfer";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4 border-b border-gray-800 bg-surface active:bg-gray-800"
    >
      <View className="flex-row items-center gap-3 flex-1">
        {coinImage ? (
          <Image source={{ uri: coinImage }} className="w-10 h-10 rounded-full" />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center">
            <Text className="text-white font-bold text-xs">
              {coinSymbol?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-white font-semibold capitalize">
              {transaction.type}
            </Text>
            {coinName && (
              <Text className="text-gray-400 text-sm">• {coinName}</Text>
            )}
          </View>
          <Text className="text-gray-500 text-xs">{formattedDate}</Text>
        </View>
      </View>

      <View className="items-end">
        <Text
          className={`font-bold text-base ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : "-"}
          {transaction.amountCrypto.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}{" "}
          {coinSymbol?.toUpperCase() || ""}
        </Text>
        <Text className="text-gray-400 text-sm">
          ${transaction.amountFiat.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      {onDelete && (
        <TouchableOpacity
          testID="delete-button"
          onPress={onDelete}
          className="ml-3 p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AntDesign name="delete" size={18} color="#EF4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

