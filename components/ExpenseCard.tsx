import { Expense } from "@/app/database/helpers";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

type Props = {
  expense: Expense;
  onDelete?: () => void;
};

export default function ExpenseCard({ expense, onDelete }: Props) {
  const theme = useTheme();

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Title
        title={expense.name}
        titleStyle={styles.title}
        right={
          onDelete
            ? () => (
                <IconButton
                  accessibilityLabel={`Delete ${expense.name}`}
                  icon="delete-outline"
                  iconColor={theme.colors.error}
                  onPress={onDelete}
                />
              )
            : undefined
        }
      />
      <Card.Content>
        <View style={styles.view}>
          <Text>{expense.description}</Text>
          <Text style={styles.amount}>{expense.amount}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
  },
  view: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amount: {
    fontWeight: "bold",
  },
});
