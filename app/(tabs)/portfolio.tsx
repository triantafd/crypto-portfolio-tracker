import { View, Text, TouchableOpacity } from "react-native";
import { useStore } from "../../store/useStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getCoinsByIds } from "../../lib/api";
import AddTransactionModal from "../../components/AddTransactionModal";
import {
  calculateHoldings,
  calculateCostBasis,
  calculateCurrentValue,
  calculateAllTimeProfit,
  calculate24hProfit,
} from "../../lib/portfolioCalculations";
import PortfolioSummary from "../../components/portfolio/PortfolioSummary";
import PortfolioTabs from "../../components/portfolio/PortfolioTabs";
import OverviewTab from "../../components/portfolio/OverviewTab";
import TransactionsTab from "../../components/portfolio/TransactionsTab";
import FilterModals from "../../components/portfolio/FilterModals";
import BannerAd from "../../components/ads/BannerAd";

type Tab = "overview" | "transactions";

export default function PortfolioScreen() {
  const insets = useSafeAreaInsets();
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    getTransactionsByCoin,
    getAllCoinIds,
    migrateOldPortfolio,
    migrated,
  } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string | undefined>();
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    "all" | "buy" | "sell" | "transfer"
  >("all");
  const [coinFilter, setCoinFilter] = useState<string>("all");
  const [hideBalance, setHideBalance] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showCoinFilter, setShowCoinFilter] = useState(false);

  // Migrate old portfolio data on first load
  useEffect(() => {
    if (!migrated) {
      migrateOldPortfolio();
    }
  }, [migrated, migrateOldPortfolio]);

  const coinIds = getAllCoinIds();
  const { data: coins } = useQuery({
    queryKey: ["portfolioCoins", coinIds],
    queryFn: () => getCoinsByIds(coinIds),
    enabled: coinIds.length > 0,
  });

  // Calculate portfolio totals
  const portfolioData = coins?.map((coin) => {
    const holdings = calculateHoldings(transactions, coin.id);
    const costBasis = calculateCostBasis(transactions, coin.id);
    const currentValue = calculateCurrentValue(holdings, coin.current_price);
    const allTimeProfit = calculateAllTimeProfit(currentValue, costBasis);
    const price24hAgo =
      coin.current_price / (1 + coin.price_change_percentage_24h / 100);
    const profit24h = calculate24hProfit(holdings, coin.current_price, price24hAgo);

    return {
      ...coin,
      holdings,
      costBasis,
      currentValue,
      allTimeProfit,
      profit24h,
    };
  }) || [];

  const totalValue = portfolioData.reduce((sum, coin) => sum + coin.currentValue, 0);
  const totalCostBasis = portfolioData.reduce((sum, coin) => sum + coin.costBasis, 0);
  const totalAllTimeProfit = calculateAllTimeProfit(totalValue, totalCostBasis);

  // Calculate 24h change for portfolio
  const totalValue24hAgo = portfolioData.reduce((sum, coin) => {
    const price24hAgo =
      coin.current_price / (1 + coin.price_change_percentage_24h / 100);
    return sum + calculateCurrentValue(coin.holdings, price24hAgo);
  }, 0);
  const portfolio24hChange = totalValue - totalValue24hAgo;
  const portfolio24hChangePercent =
    totalValue24hAgo > 0 ? (portfolio24hChange / totalValue24hAgo) * 100 : 0;

  // Get selected coin data if a coin is selected
  const selectedCoin = selectedCoinId
    ? portfolioData.find((coin) => coin.id === selectedCoinId)
    : null;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const typeMatch =
      transactionTypeFilter === "all" || tx.type === transactionTypeFilter;
    const coinMatch = selectedCoinId
      ? tx.coinId === selectedCoinId
      : coinFilter === "all" || tx.coinId === coinFilter;
    return typeMatch && coinMatch;
  });

  const handleAddTransaction = (transaction: Parameters<typeof addTransaction>[0]) => {
    addTransaction(transaction);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Clear coin selection when manually switching to transactions tab
    if (tab === "transactions" && activeTab !== "transactions") {
      setSelectedCoinId(undefined);
    }
  };

  const handleCoinPress = (coinId: string) => {
    setSelectedCoinId(coinId);
    setCoinFilter("all");
    setActiveTab("transactions");
  };

  const handleSelectCoin = (coinId: string | undefined) => {
    setSelectedCoinId(coinId);
    setCoinFilter(coinId || "all");
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-800 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Portfolio</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedCoinId(undefined);
            setModalVisible(true);
          }}
          className="w-10 h-10 items-center justify-center rounded-full bg-primary"
        >
          <AntDesign name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Portfolio Summary */}
      <PortfolioSummary
        totalValue={totalValue}
        portfolio24hChange={portfolio24hChange}
        portfolio24hChangePercent={portfolio24hChangePercent}
        totalAllTimeProfit={totalAllTimeProfit}
        hideBalance={hideBalance}
        onToggleHideBalance={() => setHideBalance(!hideBalance)}
      />

      {/* Tabs */}
      <PortfolioTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content */}
      {activeTab === "overview" ? (
        <OverviewTab portfolioData={portfolioData} onCoinPress={handleCoinPress} />
      ) : (
        <TransactionsTab
          transactions={filteredTransactions}
          selectedCoin={selectedCoin || undefined}
          transactionTypeFilter={transactionTypeFilter}
          selectedCoinId={selectedCoinId}
          coinFilter={coinFilter}
          coins={coins}
          onTypeFilterPress={() => setShowTypeFilter(true)}
          onCoinFilterPress={() => setShowCoinFilter(true)}
          onDeleteTransaction={deleteTransaction}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          setSelectedCoinId(undefined);
          setModalVisible(true);
        }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        style={{ marginBottom: insets.bottom }}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTransaction}
        coinId={selectedCoinId}
      />

      {/* Filter Modals */}
      <FilterModals
        showTypeFilter={showTypeFilter}
        showCoinFilter={showCoinFilter}
        transactionTypeFilter={transactionTypeFilter}
        selectedCoinId={selectedCoinId}
        coinFilter={coinFilter}
        coins={coins}
        onCloseTypeFilter={() => setShowTypeFilter(false)}
        onCloseCoinFilter={() => setShowCoinFilter(false)}
        onSelectType={(type) => {
          setTransactionTypeFilter(type);
          setShowTypeFilter(false);
        }}
        onSelectCoin={handleSelectCoin}
      />
    </View>
  );
}
