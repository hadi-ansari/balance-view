import { getSemanticColors } from "@/theme/appTheme";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Svg, { Circle } from "react-native-svg";

type BudgetRingProps = {
  expenses: number;
  income: number;
  size?: number;
};

const STROKE_WIDTH = 22;

function formatAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function BudgetRing({
  expenses,
  income,
  size = 236,
}: BudgetRingProps) {
  const theme = useTheme();
  const semanticColors = getSemanticColors(theme.dark);
  const safeIncome = Number.isFinite(income) ? Math.max(0, income) : 0;
  const safeExpenses = Number.isFinite(expenses) ? Math.max(0, expenses) : 0;
  const balance = safeIncome - safeExpenses;
  const isOverBudget = balance < 0;
  const hasIncome = safeIncome > 0;
  const spentRatio = hasIncome
    ? Math.min(safeExpenses / safeIncome, 1)
    : safeExpenses > 0
      ? 1
      : 0;
  const remainingPercent = hasIncome
    ? Math.max(0, Math.round((1 - spentRatio) * 100))
    : 0;

  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const expenseArcLength = circumference * spentRatio;
  const remainingColor = semanticColors.remaining;
  const expenseColor = semanticColors.expense;
  const baseColor = hasIncome
    ? remainingColor
    : theme.colors.surfaceVariant;

  const amountLabel = formatAmount(Math.abs(balance));
  const statusLabel = isOverBudget
    ? "over budget"
    : hasIncome
      ? "left this month"
      : "available";
  const accessibilityLabel = `Monthly income ${formatAmount(safeIncome)}. Monthly expenses ${formatAmount(safeExpenses)}. ${amountLabel} ${statusLabel}.`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, { width: size, height: size }]}
    >
      <Svg width={size} height={size} style={styles.chart}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={baseColor}
          strokeWidth={STROKE_WIDTH}
        />
        {spentRatio > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            origin={`${size / 2}, ${size / 2}`}
            rotation={-90}
            stroke={expenseColor}
            strokeDasharray={[expenseArcLength, circumference - expenseArcLength]}
            strokeWidth={STROKE_WIDTH}
          />
        )}
      </Svg>

      <View pointerEvents="none" style={styles.labelContainer}>
        <Text
          style={[
            styles.amount,
            { color: isOverBudget ? expenseColor : theme.colors.onSurface },
          ]}
          variant="headlineLarge"
        >
          {amountLabel}
        </Text>
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="bodyMedium"
        >
          {statusLabel}
        </Text>
        {hasIncome && !isOverBudget && (
          <Text
            style={{ color: theme.colors.onSurfaceVariant }}
            variant="labelMedium"
          >
            {remainingPercent}% remaining
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    position: "absolute",
  },
  labelContainer: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 38,
  },
  amount: {
    fontWeight: "700",
  },
});
