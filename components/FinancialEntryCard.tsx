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
};

export default function FinancialEntryCard({ entry, onDelete }: Props) {
  const theme = useTheme();

  return (
    <Card style={styles.card} elevation={1}>
      <Card.Title
        title={entry.name}
        titleStyle={styles.title}
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
          <Text>{entry.description}</Text>
          <Text style={styles.amount}>{entry.amount}</Text>
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
