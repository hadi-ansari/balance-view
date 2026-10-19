import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { List, useTheme } from "react-native-paper";

export default function EditScreen() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <List.Section>
        <Link href="/edit-expenses" asChild>
          <List.Item
            left={(props) => <Feather name="dollar-sign" {...props} />}
            title="Expenses"
          />
        </Link>
        <Link href="/edit-income" asChild>
          <List.Item
            left={(props) => <Feather name="calendar" {...props} />}
            title="Income"
          />
        </Link>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
