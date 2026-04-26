import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, H3 } from "tamagui";
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
      <H3 style={styles.text}>Monthly expenses: {totalExpenses}</H3>
      <H3 style={styles.text}>Monthly income: {totalIncome}</H3>
      <Link href="/edit" asChild>
        <Button>Edit</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {},
  stack: {},
});
