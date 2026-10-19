import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

type FinancialEntry = {
  name: string;
  amount: number;
  description: string | null;
};

type Props = {
  entry: FinancialEntry;
  onDelete?: () => void;
  tone?: "default" | "expense";
};

export default function FinancialEntryCard({
  entry,
  onDelete,
  tone = "default",
}: Props) {
  const theme = useTheme();
  const isExpense = tone === "expense";
  const expenseTextStyle = isExpense
    ? { color: theme.colors.onErrorContainer }
    : undefined;

  return (
    <Card
      style={[
        styles.card,
        isExpense && { backgroundColor: theme.colors.errorContainer },
      ]}
      elevation={1}
    >
      <Card.Title
        title={entry.name}
        titleStyle={[styles.title, expenseTextStyle]}
        right={
          onDelete
            ? () => (
                <IconButton
                  accessibilityLabel={`Delete ${entry.name}`}
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
          <Text style={expenseTextStyle}>{entry.description}</Text>
          <Text style={[styles.amount, expenseTextStyle]}>{entry.amount}</Text>
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
