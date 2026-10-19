import BudgetRing, { BUDGET_REMAINING_COLOR } from "@/components/BudgetRing";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text, useTheme } from "react-native-paper";
import { useExpenses, useIncome } from "../database/helpers";

function formatAmount(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function EconomyScreen() {
  const { getAll: getAllExpenses } = useExpenses();
  const { getAll: getAllIncome } = useIncome();
  const theme = useTheme();

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let isActive = true;

    const fetchTotals = async () => {
      try {
        const [expenses, income] = await Promise.all([
          getAllExpenses(),
          getAllIncome(),
        ]);
        const totalExpensesValue = expenses.reduce((p, c) => p + c.amount, 0);
        const totalIncomeValue = income.reduce((p, c) => p + c.amount, 0);

        if (isActive) {
          setTotalExpenses(totalExpensesValue);
          setTotalIncome(totalIncomeValue);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchTotals();

    return () => {
      isActive = false;
    };
  }, [getAllExpenses, getAllIncome]));

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.heading}>
        <Text variant="headlineMedium">Monthly balance</Text>
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="bodyMedium"
        >
          See where your income is going this month.
        </Text>
      </View>

      <Card mode="elevated" style={styles.balanceCard}>
        <Card.Content style={styles.cardContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text variant="bodyMedium">Calculating your balance…</Text>
            </View>
          ) : (
            <>
              <BudgetRing expenses={totalExpenses} income={totalIncome} />

              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: theme.colors.error },
                    ]}
                  />
                  <Text variant="bodySmall">Spent</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: BUDGET_REMAINING_COLOR },
                    ]}
                  />
                  <Text variant="bodySmall">Remaining</Text>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.summaryRow}>
        <Card mode="contained" style={styles.summaryCard}>
          <Card.Content>
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="labelLarge"
            >
              Income
            </Text>
            <Text variant="titleLarge">
              {isLoading ? "—" : formatAmount(totalIncome)}
            </Text>
          </Card.Content>
        </Card>
        <Card mode="contained" style={styles.summaryCard}>
          <Card.Content>
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="labelLarge"
            >
              Expenses
            </Text>
            <Text style={{ color: theme.colors.error }} variant="titleLarge">
              {isLoading ? "—" : formatAmount(totalExpenses)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Link href="/edit" asChild>
        <Button icon="pencil-outline" mode="contained" style={styles.editButton}>
          Edit income and expenses
        </Button>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 18,
    padding: 20,
    paddingBottom: 36,
  },
  heading: {
    gap: 4,
  },
  balanceCard: {
    borderRadius: 24,
  },
  cardContent: {
    alignItems: "center",
    gap: 18,
    paddingVertical: 24,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
    height: 272,
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    gap: 24,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
  },
  editButton: {
    marginTop: 2,
  },
});
