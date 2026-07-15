import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from 'react-native-paper';
import { Expense, useExpenses, useIncome } from "../database/helpers";

export default function EconomyScreen() {
  const { getAll: getAllExpenses } = useExpenses();
  const { getAll: getAllIncome } = useIncome();

  const [totalExpenses, setTotalExpenses] = useState<number>();
  const [totalIncome, setTotalIncome] = useState<number>();

  useEffect(() => {
    getAllExpenses().then((e: Expense[]) => {
      const total = e.reduce((p, c) => p + c.amount, 0);
      setTotalExpenses(total);
    });

    getAllIncome().then((e: Expense[]) => {
      const total = e.reduce((p, c) => p + c.amount, 0);
      setTotalIncome(total);
    });
  }, [getAllExpenses, getAllIncome]);
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
