import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Transaction } from "../store/useStore";
import { useQuery } from "@tanstack/react-query";
import { getCoins } from "../lib/api";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, "id">) => void;
  coinId?: string; // Pre-select a coin if provided
  coinName?: string;
}

export default function AddTransactionModal({
  visible,
  onClose,
  onSave,
  coinId: preselectedCoinId,
  coinName: preselectedCoinName,
}: AddTransactionModalProps) {
  const [coinId, setCoinId] = useState(preselectedCoinId || "");
  const [coinName, setCoinName] = useState(preselectedCoinName || "");
  const [type, setType] = useState<"buy" | "sell" | "transfer">("buy");
  const [amountCrypto, setAmountCrypto] = useState("");
  const [amountFiat, setAmountFiat] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [fee, setFee] = useState("");
  const [notes, setNotes] = useState("");
  const [showCoinSearch, setShowCoinSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to validate and format decimal input
  // Accepts both comma and dot as decimal separators, converts comma to dot
  const handleDecimalInput = (value: string, setter: (value: string) => void) => {
    // Replace comma with dot for consistency
    const normalizedValue = value.replace(",", ".");
    // Allow empty string, numbers, and one decimal point
    const decimalRegex = /^\d*\.?\d*$/;
    if (normalizedValue === "" || decimalRegex.test(normalizedValue)) {
      setter(normalizedValue);
    }
  };

  const { data: coins } = useQuery({
    queryKey: ["coins", "search"],
    queryFn: () => getCoins(1, 100),
    enabled: showCoinSearch,
  });

  useEffect(() => {
    if (preselectedCoinId) {
      setCoinId(preselectedCoinId);
      setCoinName(preselectedCoinName || "");
    }
  }, [preselectedCoinId, preselectedCoinName]);

  useEffect(() => {
    // Auto-calculate amountFiat when pricePerCoin or amountCrypto changes
    if (pricePerCoin && amountCrypto) {
      const calculated = parseFloat(pricePerCoin) * parseFloat(amountCrypto);
      setAmountFiat(calculated.toFixed(2));
    }
  }, [pricePerCoin, amountCrypto]);

  const handleSave = () => {
    if (!coinId || !amountCrypto || !amountFiat || !date) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const transaction: Omit<Transaction, "id"> = {
      coinId: coinId.toLowerCase(),
      type,
      amountCrypto: parseFloat(amountCrypto),
      amountFiat: parseFloat(amountFiat),
      date: new Date(date).toISOString(),
      fee: fee ? parseFloat(fee) : undefined,
      notes: notes || undefined,
    };

    onSave(transaction);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCoinId(preselectedCoinId || "");
    setCoinName(preselectedCoinName || "");
    setType("buy");
    setAmountCrypto("");
    setAmountFiat("");
    setPricePerCoin("");
    setDate(new Date().toISOString().split("T")[0]);
    setFee("");
    setNotes("");
    setShowCoinSearch(false);
    setSearchQuery("");
  };

  const handleCoinSelect = (coin: any) => {
    setCoinId(coin.id);
    setCoinName(coin.name);
    setPricePerCoin(coin.current_price.toString());
    setShowCoinSearch(false);
    setSearchQuery("");
  };

  const filteredCoins = coins?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-surface rounded-t-3xl max-h-[90%]">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
            <Text className="text-xl font-bold text-white">Add Transaction</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {/* Transaction Type */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Type</Text>
              <View className="flex-row gap-2">
                {(["buy", "sell", "transfer"] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    className={`flex-1 py-3 rounded-xl items-center ${
                      type === t ? "bg-primary" : "bg-gray-700"
                    }`}
                  >
                    <Text className="text-white font-semibold capitalize">{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Coin Selection */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Coin</Text>
              <TouchableOpacity
                onPress={() => setShowCoinSearch(!showCoinSearch)}
                className="bg-background p-4 rounded-xl flex-row items-center justify-between"
              >
                <Text className="text-white">
                  {coinName || "Select a coin"}
                </Text>
                <AntDesign name="down" size={16} color="#94A3B8" />
              </TouchableOpacity>

              {showCoinSearch && (
                <View className="mt-2 bg-background rounded-xl max-h-64">
                  <TextInput
                    placeholder="Search coins..."
                    placeholderTextColor="#94A3B8"
                    className="bg-gray-800 p-3 rounded-t-xl text-white border-b border-gray-700"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                  <ScrollView className="max-h-48">
                    {filteredCoins?.map((coin) => (
                      <TouchableOpacity
                        key={coin.id}
                        onPress={() => handleCoinSelect(coin)}
                        className="flex-row items-center gap-3 p-3 border-b border-gray-800"
                      >
                        <Text className="text-white flex-1">{coin.name}</Text>
                        <Text className="text-gray-400 uppercase">
                          {coin.symbol}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Amount (Crypto) */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Amount (Crypto)</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                className="bg-background p-4 rounded-xl text-white"
                value={amountCrypto}
                onChangeText={(value) => handleDecimalInput(value, setAmountCrypto)}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Price Per Coin */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Price Per Coin (USD)</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                className="bg-background p-4 rounded-xl text-white"
                value={pricePerCoin}
                onChangeText={(value) => handleDecimalInput(value, setPricePerCoin)}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Total (USD) */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Total (USD)</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                className="bg-background p-4 rounded-xl text-white"
                value={amountFiat}
                onChangeText={(value) => handleDecimalInput(value, setAmountFiat)}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Date</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                className="bg-background p-4 rounded-xl text-white"
                value={date}
                onChangeText={setDate}
              />
            </View>

            {/* Fee (Optional) */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Fee (Optional)</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                className="bg-background p-4 rounded-xl text-white"
                value={fee}
                onChangeText={(value) => handleDecimalInput(value, setFee)}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Notes (Optional) */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-2">Notes (Optional)</Text>
              <TextInput
                placeholder="Add a note..."
                placeholderTextColor="#94A3B8"
                className="bg-background p-4 rounded-xl text-white"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Buttons */}
            <View className="flex-row gap-4 mb-4">
              <TouchableOpacity
                className="flex-1 bg-gray-700 p-4 rounded-xl items-center"
                onPress={() => {
                  handleReset();
                  onClose();
                }}
              >
                <Text className="text-white font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary p-4 rounded-xl items-center"
                onPress={handleSave}
              >
                <Text className="text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

