import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getSemanticColors } from "@/theme/appTheme";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

type FinancialEntry = {
  name: string;
  amount: number;
  description: string | null;
};

type Props = {
  entry: FinancialEntry;
  kind: "expense" | "income";
  onDelete?: () => void;
};

export default function FinancialEntryCard({
  entry,
  kind,
  onDelete,
}: Props) {
  const theme = useTheme();
  const semanticColors = getSemanticColors(theme.dark);
  const isExpense = kind === "expense";
  const amountColor = isExpense
    ? semanticColors.expense
    : semanticColors.remaining;
  const iconBackgroundColor = isExpense
    ? theme.colors.error
    : theme.colors.primaryContainer;
  const iconColor = isExpense
    ? theme.colors.onError
    : theme.colors.onPrimaryContainer;
  const formattedAmount = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(Math.abs(entry.amount));

  return (
    <Card
      style={[
        styles.card,
        isExpense && { backgroundColor: theme.colors.errorContainer },
      ]}
      elevation={1}
    >
      <Card.Content style={styles.content}>
        <View
          style={[
            styles.entryIcon,
            { backgroundColor: iconBackgroundColor },
          ]}
        >
          <MaterialCommunityIcons
            color={iconColor}
            name={isExpense ? "arrow-down" : "arrow-up"}
            size={24}
          />
        </View>

        <View style={styles.details}>
          <Text
            numberOfLines={1}
            style={styles.title}
            variant="titleMedium"
          >
            {entry.name}
          </Text>
          {entry.description ? (
            <Text
              numberOfLines={2}
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="bodySmall"
            >
              {entry.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.trailingContent}>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={[styles.amount, { color: amountColor }]}
            variant="titleLarge"
          >
            {isExpense ? "−" : "+"}
            {formattedAmount}
          </Text>
          {onDelete ? (
            <IconButton
              accessibilityLabel={`Delete ${entry.name}`}
              icon="delete-outline"
              iconColor={theme.colors.error}
              onPress={onDelete}
              size={20}
              style={styles.deleteButton}
            />
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 6,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 88,
    paddingVertical: 14,
  },
  entryIcon: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  details: {
    flex: 1,
    gap: 3,
    marginLeft: 12,
    minWidth: 0,
  },
  title: {
    fontWeight: "600",
  },
  trailingContent: {
    alignItems: "flex-end",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginLeft: 10,
    maxWidth: "42%",
  },
  amount: {
    fontWeight: "700",
  },
  deleteButton: {
    height: 36,
    margin: 0,
    width: 36,
  },
});
