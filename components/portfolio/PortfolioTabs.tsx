import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";

type Tab = "overview" | "transactions";

interface PortfolioTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function PortfolioTabs({ activeTab, onTabChange }: PortfolioTabsProps) {
  return (
    <View className="flex-row border-b border-gray-800 px-4">
      <TouchableOpacity
        onPress={() => onTabChange("overview")}
        className={clsx(
          "py-3 px-4 border-b-2",
          activeTab === "overview" ? "border-primary" : "border-transparent"
        )}
      >
        <Text
          className={clsx(
            "font-semibold",
            activeTab === "overview" ? "text-primary" : "text-gray-400"
          )}
        >
          Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabChange("transactions")}
        className={clsx(
          "py-3 px-4 border-b-2",
          activeTab === "transactions" ? "border-primary" : "border-transparent"
        )}
      >
        <Text
          className={clsx(
            "font-semibold",
            activeTab === "transactions" ? "text-primary" : "text-gray-400"
          )}
        >
          Transactions
        </Text>
      </TouchableOpacity>
    </View>
  );
}

