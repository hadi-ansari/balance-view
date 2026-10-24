import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { darkAppTheme, darkNavigationTheme, lightAppTheme, lightNavigationTheme } from "@/theme/appTheme";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import React, { Suspense } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { migrateDb } from "./database/migrate-db";

export default function RootLayout() {
  const isDark = useColorScheme() === "dark";
  const paperTheme = isDark ? darkAppTheme : lightAppTheme;
  const navigationTheme = isDark ? darkNavigationTheme : lightNavigationTheme;

  return (
    <Suspense fallback={<></>}>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={navigationTheme}>
          <SQLiteProvider
            databaseName="my-database.db"
            onInit={migrateDb}
            useSuspense
          >
            <CurrencyProvider>
              <StatusBar style={isDark ? "light" : "dark"} />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="edit" options={{ title: "Edit" }} />
                <Stack.Screen
                  name="edit-expenses"
                  options={{ title: "Edit expenses" }}
                />
                <Stack.Screen
                  name="edit-income"
                  options={{ title: "Edit income" }}
                />
              </Stack>
            </CurrencyProvider>
          </SQLiteProvider>
        </ThemeProvider>
      </PaperProvider>
    </Suspense>
  );
}
