import ExpenseCard from "@/components/ExpenseCard";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Fieldset,
  Input,
  Label,
  Unspaced,
  XStack,
} from "tamagui";
import { Expense, useExpenses } from "./database/helpers";

export default function EditScreen() {
  const { getAll, insert } = useExpenses();
  const [expenses, setExpenses] = useState<Expense[]>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getAll().then((e) => setExpenses(e));
  }, [getAll]);

  const addExpense = useCallback(() => {
    insert("Rent", 6500, "Stångstaden");
  }, [insert]);

  const refresh = useCallback(() => {
    getAll().then((e) => {
      setExpenses(e);
    });
  }, [getAll]);

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {expenses?.map((e, idx) => {
          return <ExpenseCard expense={e} key={idx} />;
        })}
      </View>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button>
            <Button.Text>Show Dialog</Button.Text>
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
              {/* <Dialog.Description>
                Make changes to your profile here. Click save when you are done.
              </Dialog.Description> */}

              <Fieldset gap="$3" horizontal>
                <Label flex={1} width={64} htmlFor="name">
                  Name
                </Label>
                <Input flex={1} id="name" type="text" />
              </Fieldset>

              <Fieldset gap="$4" horizontal>
                <Label flex={1} width={64} htmlFor="amount">
                  Amount
                </Label>
                <Input flex={1} id="amount" type="number" />
              </Fieldset>

              <Fieldset gap="$4" horizontal>
                <Label flex={1} width={64} htmlFor="description">
                  Description
                </Label>
                <Input flex={1} id="description" type="text" />
              </Fieldset>

              <XStack self="flex-end" gap="$4">
                <Dialog.Close displayWhenAdapted asChild>
                  <Button theme="accent" aria-label="Close">
                    Save changes
                  </Button>
                </Dialog.Close>
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

      <Button onPress={refresh}>Refresh</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "100%",
    padding: 10,
    gap: 10,
  },
});
