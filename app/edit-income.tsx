import FinancialEntryCard from "@/components/FinancialEntryCard";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Income, useIncome } from "./database/helpers";

type FormErrors = {
  name?: string;
  amount?: string;
};

export default function EditIncomeScreen() {
  const { getAll, insert, remove } = useIncome();
  const theme = useTheme();
  const [income, setIncome] = useState<Income[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  // Form state for income
  const [incomeName, setIncomeName] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeErrors, setIncomeErrors] = useState<FormErrors>({});

  useEffect(() => {
    getAll().then((e) => setIncome(e));
  }, [getAll]);

  const refresh = useCallback(() => {
    getAll().then((e) => setIncome(e));
  }, [getAll]);

  const resetForm = useCallback(() => {
    setIncomeName("");
    setIncomeAmount("");
    setIncomeDescription("");
    setIncomeErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!incomeName.trim()) {
      newErrors.name = "Name is required";
    }

    if (!incomeAmount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(incomeAmount)) || Number(incomeAmount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setIncomeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [incomeName, incomeAmount]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    await insert(
      incomeName.trim(),
      Number(incomeAmount),
      incomeDescription.trim() || undefined,
    );
    await refresh();
    resetForm();
    setOpen(false);
  }, [
    validate,
    insert,
    incomeName,
    incomeAmount,
    incomeDescription,
    refresh,
    resetForm,
  ]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    },
    [resetForm],
  );

  const handleDelete = useCallback(async () => {
    if (!incomeToDelete) return;

    setIsDeleting(true);
    try {
      await remove(incomeToDelete.id);
      setIncome((current) =>
        current?.filter((item) => item.id !== incomeToDelete.id),
      );
      setMessage(`“${incomeToDelete.name}” was deleted.`);
      setIncomeToDelete(null);
    } catch (error) {
      console.error("Error deleting income:", error);
      setMessage("Could not delete the income. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [incomeToDelete, remove]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {income?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="titleMedium">No income yet</Text>
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="bodyMedium"
            >
              Add your first monthly income to get started.
            </Text>
          </View>
        ) : (
          income?.map((item) => (
            <FinancialEntryCard
              entry={item}
              key={item.id}
              onDelete={() => setIncomeToDelete(item)}
            />
          ))
        )}
      </ScrollView>

      <Button
        icon="plus"
        mode="contained"
        onPress={() => setOpen(true)}
        style={styles.addButton}
      >
        Add Income
      </Button>

      <Portal>
        <Dialog visible={open} onDismiss={() => handleOpenChange(false)}>
          <Dialog.Title>Add Income</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="e.g. Monthly salary"
              value={incomeName}
              onChangeText={setIncomeName}
              error={!!incomeErrors.name}
            />
            {incomeErrors.name && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {incomeErrors.name}
              </Text>
            )}

            <Text style={styles.label}>Amount</Text>
            <TextInput
              placeholder="e.g. 500"
              value={incomeAmount}
              onChangeText={setIncomeAmount}
              keyboardType="decimal-pad"
              error={!!incomeErrors.amount}
            />
            {incomeErrors.amount && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {incomeErrors.amount}
              </Text>
            )}

            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              placeholder="e.g. From my company"
              value={incomeDescription}
              onChangeText={setIncomeDescription}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => handleOpenChange(false)}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={incomeToDelete !== null}
          onDismiss={() => !isDeleting && setIncomeToDelete(null)}
        >
          <Dialog.Icon icon="alert-outline" />
          <Dialog.Title style={styles.dialogTitle}>Delete income?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {incomeToDelete
                ? `“${incomeToDelete.name}” will be permanently removed from your monthly income.`
                : "This income will be permanently removed."}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              disabled={isDeleting}
              onPress={() => setIncomeToDelete(null)}
            >
              Keep income
            </Button>
            <Button
              loading={isDeleting}
              onPress={handleDelete}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Snackbar
          duration={3000}
          onDismiss={() => setMessage("")}
          visible={message.length > 0}
        >
          {message}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 8,
    width: "100%",
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    gap: 6,
    justifyContent: "center",
    padding: 32,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  error: {
    fontSize: 12,
  },
  addButton: {
    margin: 10,
  },
  dialogTitle: {
    textAlign: "center",
  },
});
