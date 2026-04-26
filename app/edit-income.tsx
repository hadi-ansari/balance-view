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

      <Dialog modal open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          <Button>
            <Button.Text>Add Income</Button.Text>
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
              <Dialog.Title>Add Income</Dialog.Title>

              {/* Name */}
              <Fieldset gap="$2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Monthly salary"
                  value={incomeName}
                  onChangeText={setIncomeName}
                  borderColor={incomeErrors.name ? "$red8" : undefined}
                />
                {incomeErrors.name && (
                  <Text color="$red10" fontSize="$2">
                    {incomeErrors.name}
                  </Text>
                )}
              </Fieldset>

              {/* Amount */}
              <Fieldset gap="$2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="e.g. 500"
                  value={incomeAmount}
                  onChangeText={setIncomeAmount}
                  keyboardType="decimal-pad"
                  borderColor={incomeErrors.amount ? "$red8" : undefined}
                />
                {incomeErrors.amount && (
                  <Text color="$red10" fontSize="$2">
                    {incomeErrors.amount}
                  </Text>
                )}
              </Fieldset>

              {/* Description (optional) */}
              <Fieldset gap="$2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g. From my company"
                  value={incomeDescription}
                  onChangeText={setIncomeDescription}
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
