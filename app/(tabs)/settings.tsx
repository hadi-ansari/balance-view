import { CURRENCIES, CurrencyCode } from "@/constants/currencies";
import { useCurrency } from "@/contexts/CurrencyContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  List,
  Portal,
  RadioButton,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";

export default function SettingsScreen() {
  const theme = useTheme();
  const { currency, formatCurrency, setCurrency } = useCurrency();
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectedCurrency =
    CURRENCIES.find((option) => option.code === currency) ?? CURRENCIES[0];

  const handleCurrencyChange = async (value: string) => {
    const nextCurrency = value as CurrencyCode;
    if (nextCurrency === currency) {
      setIsCurrencyDialogOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      await setCurrency(nextCurrency);
      setIsCurrencyDialogOpen(false);
      setMessage(`Currency changed to ${nextCurrency}.`);
    } catch (error) {
      console.error("Error saving currency:", error);
      setMessage("Could not save the currency. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.heading}>
        <Text variant="headlineMedium">Settings</Text>
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="bodyMedium"
        >
          Personalize how Balance View works for you.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium">General</Text>
        <Card mode="elevated" style={styles.settingCard}>
          <List.Item
            description={`${selectedCurrency.code === "SEK" ? "kr" : selectedCurrency.code} · Example: ${formatCurrency(1234.56)}`}
            left={() => (
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <MaterialCommunityIcons
                  color={theme.colors.onPrimaryContainer}
                  name="currency-usd"
                  size={24}
                />
              </View>
            )}
            onPress={() => setIsCurrencyDialogOpen(true)}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            title="Currency"
            titleStyle={styles.settingTitle}
          />
        </Card>
      </View>

      <Text
        style={{ color: theme.colors.onSurfaceVariant }}
        variant="bodySmall"
      >
        Changing currency updates how amounts are displayed. It does not
        convert existing values using an exchange rate.
      </Text>

      <Portal>
        <Dialog
          dismissable={!isSaving}
          onDismiss={() => setIsCurrencyDialogOpen(false)}
          visible={isCurrencyDialogOpen}
        >
          <Dialog.Title>Choose currency</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <RadioButton.Group
              onValueChange={handleCurrencyChange}
              value={currency}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {CURRENCIES.map((option) => (
                  <RadioButton.Item
                    disabled={isSaving}
                    key={option.code}
                    label={
                      option.code === "SEK"
                        ? "kr  ·  Swedish Krona"
                        : `${option.code}  ·  ${option.name} (${option.symbol})`
                    }
                    position="leading"
                    value={option.code}
                  />
                ))}
              </ScrollView>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              disabled={isSaving}
              onPress={() => setIsCurrencyDialogOpen(false)}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Snackbar
          duration={2500}
          onDismiss={() => setMessage("")}
          visible={message.length > 0}
        >
          {message}
        </Snackbar>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 20,
    padding: 20,
    paddingBottom: 36,
  },
  heading: {
    gap: 4,
  },
  section: {
    gap: 12,
  },
  settingCard: {
    borderRadius: 18,
    overflow: "hidden",
  },
  settingIcon: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    marginLeft: 8,
    width: 44,
  },
  settingTitle: {
    fontWeight: "600",
  },
  dialogContent: {
    maxHeight: 440,
  },
});
