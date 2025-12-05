import React, { createContext, useContext, useMemo } from "react";
import { View, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const ChartContext = createContext<{ data: Array<{ timestamp: number; value: number }> } | null>(null);

interface LineChartProviderProps {
  data: Array<{ timestamp: number; value: number }>;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export function LineChartProvider({ data, children, width, height }: LineChartProviderProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const chartWidth = width || SCREEN_WIDTH - 64;
  const chartHeight = height || 250;

  return (
    <ChartContext.Provider value={{ data }}>
      <View style={{ width: chartWidth, height: chartHeight }}>
        {children}
      </View>
    </ChartContext.Provider>
  );
}

interface LineChartProps {
  children: React.ReactNode;
  height?: number;
}

export function LineChart({ children, height = 250 }: LineChartProps) {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("LineChart must be used within LineChartProvider");
  }

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const chartWidth = SCREEN_WIDTH - 64;
  const chartHeight = height;

  const { data } = context;
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * (chartWidth - 40);
      const y = chartHeight - 20 - ((d.value - minValue) / valueRange) * (chartHeight - 40);
      return `${x + 20},${y + 20}`;
    })
    .join(" ");

  const areaPath = useMemo(() => {
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    const firstX = 20;
    const firstY = chartHeight - 20 - ((firstPoint.value - minValue) / valueRange) * (chartHeight - 40);
    const lastX = chartWidth - 20;
    const lastY = chartHeight - 20;
    return `M${firstX},${firstY + 20} ${points} L${lastX},${lastY} L${firstX},${lastY} Z`;
  }, [data, points, chartWidth, chartHeight, minValue, valueRange]);

  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {children}
    </Svg>
  );
}

interface LineChartPathProps {
  color?: string;
  width?: number;
  children?: React.ReactNode;
}

export function LineChartPath({ color = "#3B82F6", width = 3, children }: LineChartPathProps) {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("LineChartPath must be used within LineChartProvider");
  }

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const chartWidth = SCREEN_WIDTH - 64;
  const chartHeight = 250;

  const { data } = context;
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * (chartWidth - 40);
      const y = chartHeight - 20 - ((d.value - minValue) / valueRange) * (chartHeight - 40);
      return `${x + 20},${y + 20}`;
    })
    .join(" ");

  const areaPath = useMemo(() => {
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    const firstX = 20;
    const firstY = chartHeight - 20 - ((firstPoint.value - minValue) / valueRange) * (chartHeight - 40);
    const lastX = chartWidth - 20;
    const lastY = chartHeight - 20;
    return `M${firstX},${firstY + 20} ${points} L${lastX},${lastY} L${firstX},${lastY} Z`;
  }, [data, points, chartWidth, chartHeight, minValue, valueRange]);

  return (
    <>
      <Path d={areaPath} fill="url(#gradient)" stroke="none" />
      <Path
        d={`M${points}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {children}
    </>
  );
}

interface LineChartGradientProps {
  color?: string;
}

export function LineChartGradient({ color = "#3B82F6" }: LineChartGradientProps) {
  // Gradient is already defined in LineChart component
  return null;
}

interface LineChartCursorCrosshairProps {
  color?: string;
  children?: React.ReactNode;
}

export function LineChartCursorCrosshair({ color = "#F8FAFC", children }: LineChartCursorCrosshairProps) {
  // Cursor functionality can be added later if needed
  return <>{children}</>;
}

interface LineChartTooltipProps {
  textStyle?: { color?: string };
}

export function LineChartTooltip({ textStyle }: LineChartTooltipProps) {
  // Tooltip functionality can be added later if needed
  return null;
}

