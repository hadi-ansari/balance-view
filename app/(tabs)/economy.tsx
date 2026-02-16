import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
