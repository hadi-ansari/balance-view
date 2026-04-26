import { CalendarOff, CircleDollarSign } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, YGroup } from "tamagui";

export default function EditScreen() {
  return (
    <View style={styles.container}>
      <YGroup
        self="center"
        borderWidth={1}
        borderColor="$borderColor"
        rounded="$4"
        overflow="hidden"
      >
        <YGroup.Item>
          <Link href="/edit-expenses" asChild>
            <ListItem gap="$3" icon={CalendarOff} title="Expenses" />
          </Link>
        </YGroup.Item>
        <YGroup.Item>
          <Link href="/edit-income" asChild>
            <ListItem gap="$3" icon={CircleDollarSign} title="Income" />
          </Link>
        </YGroup.Item>
      </YGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});
