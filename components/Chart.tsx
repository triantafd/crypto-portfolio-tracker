import { View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getCoinHistory } from "../lib/api";
import {
  LineChartProvider,
  LineChart,
  LineChartPath,
  LineChartGradient,
  LineChartCursorCrosshair,
  LineChartTooltip,
} from "./LineChart";

interface ChartProps {
  id: string;
  days: string;
}

export default function Chart({ id, days }: ChartProps) {
  const { data: prices, isLoading } = useQuery({
    queryKey: ["coinHistory", id, days],
    queryFn: () => getCoinHistory(id, days),
  });

  if (isLoading || !prices || prices.length === 0) {
    return (
      <View className="h-64 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const chartData = prices.map(([timestamp, value]) => ({
    timestamp,
    value,
  }));

  return (
    <View className="bg-surface rounded-xl p-4 my-4">
      <LineChartProvider data={chartData}>
        <LineChart height={250}>
          <LineChartPath color="#3B82F6" width={3}>
            <LineChartGradient color="#3B82F6" />
          </LineChartPath>
          <LineChartCursorCrosshair color="#F8FAFC">
            <LineChartTooltip textStyle={{ color: "white" }} />
          </LineChartCursorCrosshair>
        </LineChart>
      </LineChartProvider>
    </View>
  );
}
