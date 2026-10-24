import ForecastChart from "@/components/ForecastChart";
import { getSemanticColors } from "@/theme/appTheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  SegmentedButtons,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { useExpenses, useIncome } from "../database/helpers";

const HORIZONS = [1, 3, 5, 10] as const;
const MILESTONES = [1, 5, 10] as const;

function formatAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
}

function formatSignedAmount(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${formatAmount(value)}`;
}

export default function Forecast() {
  const { getAll: getAllExpenses } = useExpenses();
  const { getAll: getAllIncome } = useIncome();
  const { width: windowWidth } = useWindowDimensions();
  const theme = useTheme();
  const semanticColors = getSemanticColors(theme.dark);

  const [selectedYears, setSelectedYears] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTotals = async () => {
        setHasError(false);
        try {
          const [expenses, income] = await Promise.all([
            getAllExpenses(),
            getAllIncome(),
          ]);
          const expensesTotal = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0,
          );
          const incomeTotal = income.reduce(
            (sum, item) => sum + item.amount,
            0,
          );

          if (isActive) {
            setTotalExpenses(expensesTotal);
            setTotalIncome(incomeTotal);
          }
        } catch (error) {
          console.error("Error fetching forecast data:", error);
          if (isActive) setHasError(true);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchTotals();

      return () => {
        isActive = false;
      };
    }, [getAllExpenses, getAllIncome]),
  );

  const monthlyBalance = totalIncome - totalExpenses;
  const projectedAmount = monthlyBalance * selectedYears * 12;
  const isPositive = projectedAmount > 0;
  const isNegative = projectedAmount < 0;
  const projectionColor = isPositive
    ? semanticColors.remaining
    : isNegative
      ? semanticColors.expense
      : theme.colors.onSurface;
  const projectionLabel = isPositive
    ? "Projected surplus"
    : isNegative
      ? "Projected shortfall"
      : "Projected balance";
  const monthlyContainerColor =
    monthlyBalance < 0
      ? theme.colors.errorContainer
      : theme.colors.primaryContainer;
  const monthlyContentColor =
    monthlyBalance < 0
      ? theme.colors.onErrorContainer
      : theme.colors.onPrimaryContainer;
  const chartWidth = Math.max(220, Math.min(windowWidth - 80, 640));
  const hasPlan = totalIncome !== 0 || totalExpenses !== 0;

  if (isLoading) {
    return (
      <View
        style={[
          styles.centeredState,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium">Building your forecast…</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View
        style={[
          styles.centeredState,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <MaterialCommunityIcons
          color={theme.colors.error}
          name="alert-circle-outline"
          size={48}
        />
        <Text variant="titleMedium">Couldn’t load your forecast</Text>
        <Text
          style={[styles.centeredText, { color: theme.colors.onSurfaceVariant }]}
          variant="bodyMedium"
        >
          Return to this tab to try loading your monthly plan again.
        </Text>
      </View>
    );
  }

  if (!hasPlan) {
    return (
      <View
        style={[
          styles.centeredState,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View
          style={[
            styles.emptyIcon,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <MaterialCommunityIcons
            color={theme.colors.onPrimaryContainer}
            name="chart-line"
            size={34}
          />
        </View>
        <Text variant="headlineSmall">No forecast yet</Text>
        <Text
          style={[styles.centeredText, { color: theme.colors.onSurfaceVariant }]}
          variant="bodyMedium"
        >
          Add monthly income and expenses to see where your current plan could
          take you.
        </Text>
        <Link href="/edit" asChild>
          <Button icon="plus" mode="contained">
            Set up monthly plan
          </Button>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.heading}>
        <Text variant="headlineMedium">Your forecast</Text>
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="bodyMedium"
        >
          See where your current monthly plan could take you.
        </Text>
      </View>

      <Card mode="elevated" style={styles.projectionCard}>
        <Card.Content style={styles.projectionContent}>
          <Text
            style={{ color: theme.colors.onSurfaceVariant }}
            variant="labelLarge"
          >
            {projectionLabel}
          </Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            numberOfLines={1}
            style={[styles.projectedAmount, { color: projectionColor }]}
          >
            {formatSignedAmount(projectedAmount)}
          </Text>
          <Text
            style={{ color: theme.colors.onSurfaceVariant }}
            variant="bodyMedium"
          >
            after {selectedYears} {selectedYears === 1 ? "year" : "years"}
          </Text>

          <Surface
            elevation={0}
            style={[
              styles.monthlyResult,
              { backgroundColor: monthlyContainerColor },
            ]}
          >
            <MaterialCommunityIcons
              color={monthlyContentColor}
              name={monthlyBalance < 0 ? "trending-down" : "trending-up"}
              size={20}
            />
            <Text
              style={[styles.monthlyResultText, { color: monthlyContentColor }]}
              variant="labelLarge"
            >
              {formatSignedAmount(monthlyBalance)} / month
            </Text>
          </Surface>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleMedium">Projection period</Text>
        <SegmentedButtons
          buttons={HORIZONS.map((years) => ({
            accessibilityLabel: `${years} ${years === 1 ? "year" : "years"}`,
            label: `${years}Y`,
            value: String(years),
          }))}
          onValueChange={(value) => setSelectedYears(Number(value))}
          value={String(selectedYears)}
        />
      </View>

      <Card mode="contained" style={styles.chartCard}>
        <Card.Content style={styles.chartContent}>
          <View style={styles.chartHeading}>
            <View>
              <Text variant="titleMedium">Balance over time</Text>
              <Text
                style={{ color: theme.colors.onSurfaceVariant }}
                variant="bodySmall"
              >
                Starting from zero
              </Text>
            </View>
            <MaterialCommunityIcons
              color={projectionColor}
              name="chart-line"
              size={26}
            />
          </View>
          <ForecastChart
            monthlyBalance={monthlyBalance}
            width={chartWidth}
            years={selectedYears}
          />
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleMedium">Milestones</Text>
        <View style={styles.milestoneList}>
          {MILESTONES.map((years) => {
            const amount = monthlyBalance * years * 12;
            const color =
              amount > 0
                ? semanticColors.remaining
                : amount < 0
                  ? semanticColors.expense
                  : theme.colors.onSurface;

            return (
              <Surface
                elevation={0}
                key={years}
                style={[
                  styles.milestone,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <View
                  style={[
                    styles.milestoneIcon,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <MaterialCommunityIcons
                    color={theme.colors.primary}
                    name="calendar-blank-outline"
                    size={21}
                  />
                </View>
                <View style={styles.milestoneText}>
                  <Text variant="labelLarge">
                    After {years} {years === 1 ? "year" : "years"}
                  </Text>
                  <Text
                    style={{ color: theme.colors.onSurfaceVariant }}
                    variant="bodySmall"
                  >
                    At your current monthly pace
                  </Text>
                </View>
                <Text
                  style={[styles.milestoneAmount, { color }]}
                  variant="titleMedium"
                >
                  {formatSignedAmount(amount)}
                </Text>
              </Surface>
            );
          })}
        </View>
      </View>

      <Card mode="contained" style={styles.assumptionCard}>
        <Card.Content style={styles.assumptionContent}>
          <MaterialCommunityIcons
            color={theme.colors.primary}
            name="information-outline"
            size={24}
          />
          <View style={styles.assumptionText}>
            <Text variant="titleSmall">How this forecast works</Text>
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="bodySmall"
            >
              This forecast starts at zero and assumes your monthly income and
              expenses stay unchanged. It does not include existing savings,
              interest, inflation, or unexpected costs.
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 20,
    padding: 20,
    paddingBottom: 36,
  },
  heading: {
    gap: 4,
  },
  projectionCard: {
    borderRadius: 24,
  },
  projectionContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  projectedAmount: {
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 50,
    marginTop: 4,
    maxWidth: "100%",
  },
  monthlyResult: {
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    gap: 7,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  monthlyResultText: {
    fontWeight: "700",
  },
  section: {
    gap: 12,
  },
  chartCard: {
    borderRadius: 20,
  },
  chartContent: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
  },
  chartHeading: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  milestoneList: {
    gap: 10,
  },
  milestone: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    padding: 14,
  },
  milestoneIcon: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  milestoneText: {
    flex: 1,
    marginLeft: 12,
  },
  milestoneAmount: {
    fontWeight: "700",
    marginLeft: 8,
    maxWidth: "34%",
  },
  assumptionCard: {
    borderRadius: 18,
  },
  assumptionContent: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  assumptionText: {
    flex: 1,
    gap: 4,
  },
  centeredState: {
    alignItems: "center",
    flex: 1,
    gap: 14,
    justifyContent: "center",
    padding: 32,
  },
  centeredText: {
    maxWidth: 320,
    textAlign: "center",
  },
  emptyIcon: {
    alignItems: "center",
    borderRadius: 34,
    height: 68,
    justifyContent: "center",
    marginBottom: 4,
    width: 68,
  },
});
