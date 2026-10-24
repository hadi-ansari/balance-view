import { useCurrency } from "@/contexts/CurrencyContext";
import { getSemanticColors } from "@/theme/appTheme";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Stop,
} from "react-native-svg";

type ForecastChartProps = {
  monthlyBalance: number;
  width: number;
  years: number;
};

const CHART_HEIGHT = 190;
const PADDING = { top: 18, right: 14, bottom: 10, left: 14 };

export default function ForecastChart({
  monthlyBalance,
  width,
  years,
}: ForecastChartProps) {
  const theme = useTheme();
  const { formatCurrency } = useCurrency();
  const semanticColors = getSemanticColors(theme.dark);
  const projectedAmount = monthlyBalance * years * 12;
  const isPositive = projectedAmount > 0;
  const isNegative = projectedAmount < 0;
  const lineColor = isPositive
    ? semanticColors.remaining
    : isNegative
      ? semanticColors.expense
      : theme.colors.outline;

  const startX = PADDING.left;
  const endX = width - PADDING.right;
  const topY = PADDING.top;
  const bottomY = CHART_HEIGHT - PADDING.bottom;
  const zeroY = isPositive ? bottomY : isNegative ? topY : CHART_HEIGHT / 2;
  const endY = isPositive ? topY : isNegative ? bottomY : zeroY;
  const linePath = `M ${startX} ${zeroY} L ${endX} ${endY}`;
  const areaPath = `M ${startX} ${zeroY} L ${endX} ${endY} L ${endX} ${zeroY} Z`;
  const directionLabel = isPositive
    ? "surplus"
    : isNegative
      ? "shortfall"
      : "balance";
  const signedAmount = formatCurrency(projectedAmount, { showSign: true });

  return (
    <View
      accessible
      accessibilityLabel={`Forecast chart from now to ${years} ${years === 1 ? "year" : "years"}, ending with a projected ${directionLabel} of ${signedAmount}.`}
      style={{ width }}
    >
      <Svg height={CHART_HEIGHT} width={width}>
        <Defs>
          <LinearGradient id="forecastFill" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={lineColor} stopOpacity={0.3} />
            <Stop offset="1" stopColor={lineColor} stopOpacity={0.03} />
          </LinearGradient>
        </Defs>

        {[0.25, 0.5, 0.75].map((position) => {
          const y = topY + (bottomY - topY) * position;
          return (
            <Line
              key={position}
              stroke={theme.colors.outlineVariant}
              strokeDasharray="4 6"
              strokeWidth={1}
              x1={startX}
              x2={endX}
              y1={y}
              y2={y}
            />
          );
        })}

        <Line
          stroke={theme.colors.outline}
          strokeWidth={1}
          x1={startX}
          x2={endX}
          y1={zeroY}
          y2={zeroY}
        />
        {projectedAmount !== 0 && (
          <Path d={areaPath} fill="url(#forecastFill)" />
        )}
        <Path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeLinecap="round"
          strokeWidth={4}
        />
        <Circle cx={startX} cy={zeroY} fill={lineColor} r={5} />
        <Circle
          cx={endX}
          cy={endY}
          fill={theme.colors.surface}
          r={7}
          stroke={lineColor}
          strokeWidth={4}
        />
      </Svg>

      <View style={styles.axisLabels}>
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="labelMedium"
        >
          Now
        </Text>
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="labelMedium"
        >
          {years} {years === 1 ? "year" : "years"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PADDING.left,
  },
});
