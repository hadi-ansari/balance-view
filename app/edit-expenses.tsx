import ExpenseCard from "@/components/ExpenseCard";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Text,
  TextInput
} from 'react-native-paper';
import { Expense, useExpenses } from "./database/helpers";

type FormErrors = {
  name?: string;
  amount?: string;
};

export default function EditExpensesScreen() {
  const { getAll, insert } = useExpenses();
  const [expenses, setExpenses] = useState<Expense[]>();
  const [open, setOpen] = useState<boolean>(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {expenses?.map((e) => (
          <ExpenseCard expense={e} key={e.id} />
        ))}
      </View>

      <Dialog visible={open} onDismiss={() => handleOpenChange(false)}>
              <Dialog.Title>Add Expense</Dialog.Title>
        <Dialog.Content>
              {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
                  placeholder="e.g. Electricity bill"
                  value={expenseName}
                  onChangeText={setExpenseName}
            error={!!expenseErrors.name}
                />
          {expenseErrors.name && (
            <Text style={styles.error}>{expenseErrors.name}</Text>
                )}

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            placeholder="e.g. 500"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            keyboardType="decimal-pad"
            error={!!expenseErrors.amount}
                />
          {expenseErrors.amount && (
            <Text style={styles.error}>{expenseErrors.amount}</Text>
          )}

          {/* Description (optional) */}
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            placeholder="e.g. January bill"
            value={expenseDescription}
            onChangeText={setExpenseDescription}
          />

          <Dialog.Actions>
            <Button onPress={() => handleOpenChange(false)}>Cancel</Button>
            <Button onPress={handleSave}>Save</Button>
          </Dialog.Actions>
            </Dialog.Content>
      </Dialog>
      <Button
        mode="contained"
        onPress={() => setOpen(true)}
        style={styles.addButton}
      >
        Add Expense
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    width: "100%",
    gap: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  addButton: {
    margin: 10,
  },
});

