import ExpenseCard from "@/components/ExpenseCard";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Text,
  Unspaced,
  XStack,
} from "tamagui";
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

      <Dialog modal open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          <Button>
            <Button.Text>Add Expense</Button.Text>
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            bg="$background"
            opacity={0.5}
            animateOnly={["transform", "opacity"]}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.FocusScope focusOnIdle>
            <Dialog.Content
              width={"90%"}
              enterStyle={{ x: 0, y: 20, opacity: 0 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
            >
              <Dialog.Title>Add Expense</Dialog.Title>

              {/* Name */}
              <Fieldset gap="$2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Electricity bill"
                  value={expenseName}
                  onChangeText={setExpenseName}
                  borderColor={expenseErrors.name ? "$red8" : undefined}
                />
                {expenseErrors.name && (
                  <Text color="$red10" fontSize="$2">
                    {expenseErrors.name}
                  </Text>
                )}
              </Fieldset>

              {/* Amount */}
              <Fieldset gap="$2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="e.g. 500"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                  keyboardType="decimal-pad"
                  borderColor={expenseErrors.amount ? "$red8" : undefined}
                />
                {expenseErrors.amount && (
                  <Text color="$red10" fontSize="$2">
                    {expenseErrors.amount}
                  </Text>
                )}
              </Fieldset>

              {/* Description (optional) */}
              <Fieldset gap="$2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g. January bill"
                  value={expenseDescription}
                  onChangeText={setExpenseDescription}
                />
              </Fieldset>

              <XStack self="flex-end" gap="$4">
                <Dialog.Close asChild>
                  <Button theme="gray">Cancel</Button>
                </Dialog.Close>
                <Button theme="accent" onPress={handleSave}>
                  Save
                </Button>
              </XStack>

              <Unspaced>
                <Dialog.Close asChild>
                  <Button position="absolute" r="$3" size="$2" circular />
                </Dialog.Close>
              </Unspaced>
            </Dialog.Content>
          </Dialog.FocusScope>
        </Dialog.Portal>
      </Dialog>
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
});
