import ExpenseCard from "@/components/ExpenseCard";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Text,
  TextInput,
} from 'react-native-paper';
import { Income, useIncome } from "./database/helpers";

type FormErrors = {
  name?: string;
  amount?: string;
};

export default function EditIncomeScreen() {
  const { getAll, insert } = useIncome();
  const [income, setIncome] = useState<Income[]>();
  const [open, setOpen] = useState<boolean>(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {income?.map((e) => (
          <ExpenseCard expense={e} key={e.id} />
        ))}
      </View>

      <Dialog visible={open} onDismiss={() => handleOpenChange(false)}>
        <Dialog.Title>Add Income</Dialog.Title>
        <Dialog.Content>
          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="e.g. Monthly salary"
            value={incomeName}
            onChangeText={setIncomeName}
            error={!!incomeErrors.name}
          />
          {incomeErrors.name && (
            <Text style={styles.error}>{incomeErrors.name}</Text>
          )}

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            placeholder="e.g. 500"
            value={incomeAmount}
            onChangeText={setIncomeAmount}
            keyboardType="decimal-pad"
            error={!!incomeErrors.amount}
          />
          {incomeErrors.amount && (
            <Text style={styles.error}>{incomeErrors.amount}</Text>
          )}

          {/* Description (optional) */}
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            placeholder="e.g. From my company"
            value={incomeDescription}
            onChangeText={setIncomeDescription}
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
        Add Income
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
