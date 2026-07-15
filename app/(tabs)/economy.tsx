import { Link, useFocusEffect } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from 'react-native-paper';
import { useExpenses, useIncome } from "../database/helpers";

export default function EconomyScreen() {
  const { getAll: getAllExpenses } = useExpenses();
  const { getAll: getAllIncome } = useIncome();

  const [totalExpenses, setTotalExpenses] = useState<number>();
  const [totalIncome, setTotalIncome] = useState<number>();

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(() => {
    const fetchTotals = async () => {
      try {
        const expenses = await getAllExpenses();
        const total = expenses.reduce((p, c) => p + c.amount, 0);
        setTotalExpenses(total);

        const income = await getAllIncome();
        const totalIncomeValue = income.reduce((p, c) => p + c.amount, 0);
        setTotalIncome(totalIncomeValue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTotals();
    
    // Return cleanup function (empty in this case)
    return () => {};
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Monthly expenses: {totalExpenses}</Text>
      <Text style={styles.text}>Monthly income: {totalIncome}</Text>
      <Link href="/edit" asChild>
        <Button mode="contained">Edit</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    marginVertical: 10,
    fontSize: 16,
  },
});
