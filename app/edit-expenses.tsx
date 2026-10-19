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
import { Expense, useExpenses } from "./database/helpers";

type FormErrors = {
  name?: string;
  amount?: string;
};

export default function EditExpensesScreen() {
  const { getAll, insert, remove } = useExpenses();
  const theme = useTheme();
  const [expenses, setExpenses] = useState<Expense[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  // Form state for expense
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseErrors, setExpenseErrors] = useState<FormErrors>({});

  useEffect(() => {
    getAll().then((e) => setExpenses(e));
  }, [getAll]);

  const refresh = useCallback(() => {
    getAll().then((e) => setExpenses(e));
  }, [getAll]);

  const resetForm = useCallback(() => {
    setExpenseName("");
    setExpenseAmount("");
    setExpenseDescription("");
    setExpenseErrors({});
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!expenseName.trim()) {
      newErrors.name = "Name is required";
    }

    if (!expenseAmount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(expenseAmount)) || Number(expenseAmount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setExpenseErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [expenseName, expenseAmount]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    await insert(
      expenseName.trim(),
      Number(expenseAmount),
      expenseDescription.trim() || undefined,
    );
    await refresh();
    resetForm();
    setOpen(false);
  }, [
    validate,
    insert,
    expenseName,
    expenseAmount,
    expenseDescription,
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
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      await remove(expenseToDelete.id);
      setExpenses((current) =>
        current?.filter((expense) => expense.id !== expenseToDelete.id),
      );
      setMessage(`“${expenseToDelete.name}” was deleted.`);
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Error deleting expense:", error);
      setMessage("Could not delete the expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [expenseToDelete, remove]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.list}>
        {expenses?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="titleMedium">No expenses yet</Text>
            <Text
              style={{ color: theme.colors.onSurfaceVariant }}
              variant="bodyMedium"
            >
              Add your first monthly expense to get started.
            </Text>
          </View>
        ) : (
          expenses?.map((expense) => (
            <FinancialEntryCard
              entry={expense}
              key={expense.id}
              onDelete={() => setExpenseToDelete(expense)}
              tone="expense"
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
        Add Expense
      </Button>

      <Portal>
        <Dialog visible={open} onDismiss={() => handleOpenChange(false)}>
          <Dialog.Title>Add Expense</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="e.g. Electricity bill"
              value={expenseName}
              onChangeText={setExpenseName}
              error={!!expenseErrors.name}
            />
            {expenseErrors.name && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {expenseErrors.name}
              </Text>
            )}

            <Text style={styles.label}>Amount</Text>
            <TextInput
              placeholder="e.g. 500"
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              keyboardType="decimal-pad"
              error={!!expenseErrors.amount}
            />
            {expenseErrors.amount && (
              <Text style={[styles.error, { color: theme.colors.error }]}>
                {expenseErrors.amount}
              </Text>
            )}

            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              placeholder="e.g. January bill"
              value={expenseDescription}
              onChangeText={setExpenseDescription}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => handleOpenChange(false)}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={expenseToDelete !== null}
          onDismiss={() => !isDeleting && setExpenseToDelete(null)}
        >
          <Dialog.Icon icon="alert-outline" />
          <Dialog.Title style={styles.dialogTitle}>Delete expense?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {expenseToDelete
                ? `“${expenseToDelete.name}” will be permanently removed from your monthly expenses.`
                : "This expense will be permanently removed."}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              disabled={isDeleting}
              onPress={() => setExpenseToDelete(null)}
            >
              Keep expense
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

