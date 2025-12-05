import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import clsx from "clsx";
import { Coin } from "../../lib/api";

interface FilterModalsProps {
  showTypeFilter: boolean;
  showCoinFilter: boolean;
  transactionTypeFilter: "all" | "buy" | "sell" | "transfer";
  selectedCoinId?: string;
  coinFilter: string;
  coins?: Coin[];
  onCloseTypeFilter: () => void;
  onCloseCoinFilter: () => void;
  onSelectType: (type: "all" | "buy" | "sell" | "transfer") => void;
  onSelectCoin: (coinId: string | undefined) => void;
}

export default function FilterModals({
  showTypeFilter,
  showCoinFilter,
  transactionTypeFilter,
  selectedCoinId,
  coinFilter,
  coins,
  onCloseTypeFilter,
  onCloseCoinFilter,
  onSelectType,
  onSelectCoin,
}: FilterModalsProps) {
  return (
    <>
      {/* Type Filter Modal */}
      <Modal
        visible={showTypeFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={onCloseTypeFilter}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={onCloseTypeFilter}
        >
          <View
            className="bg-surface rounded-xl w-64 max-h-96"
            onStartShouldSetResponder={() => true}
          >
            {(["all", "buy", "sell", "transfer"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  onSelectType(type);
                  onCloseTypeFilter();
                }}
                className={clsx(
                  "p-4 border-b border-gray-800",
                  transactionTypeFilter === type && "bg-gray-700"
                )}
              >
                <Text className="text-white text-sm">
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Coin Filter Modal */}
      <Modal
        visible={showCoinFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={onCloseCoinFilter}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={onCloseCoinFilter}
        >
          <View
            className="bg-surface rounded-xl w-64 max-h-96"
            onStartShouldSetResponder={() => true}
          >
            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  onSelectCoin(undefined);
                  onCloseCoinFilter();
                }}
                className={clsx(
                  "p-4 border-b border-gray-800",
                  !selectedCoinId && coinFilter === "all" && "bg-gray-700"
                )}
              >
                <Text className="text-white text-sm">All Coins</Text>
              </TouchableOpacity>
              {coins?.map((coin) => (
                <TouchableOpacity
                  key={coin.id}
                  onPress={() => {
                    onSelectCoin(coin.id);
                    onCloseCoinFilter();
                  }}
                  className={clsx(
                    "p-4 border-b border-gray-800",
                    selectedCoinId === coin.id && "bg-gray-700"
                  )}
                >
                  <Text className="text-white text-sm">{coin.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

