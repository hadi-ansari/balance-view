import { Expense } from "@/app/database/helpers";
import { StyleSheet, View } from "react-native";
import { Card, H5, Strong, Text } from "tamagui";

type Props = {
  expense: Expense;
};

export default function ExpenseCard({ expense }: Props) {
  return (
    <Card padding={5}>
      <Card.Header p="$0">
        <H5 size={"$5"}>{expense.name}</H5>
      </Card.Header>
      <View style={styles.view}>
        <Text>{expense.description}</Text>
        <Strong>{expense.amount}</Strong>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  view: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
