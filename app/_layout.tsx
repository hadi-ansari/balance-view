import { config } from "@/tamagui.config";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { TamaguiProvider } from "tamagui";
import { migrateDb } from "./database/migrate-db";

export default function RootLayout() {
  return (
    <Suspense fallback={<></>}>
      <TamaguiProvider config={config} defaultTheme="light">
        <SQLiteProvider
          databaseName="my-database.db"
          onInit={migrateDb}
          useSuspense
        >
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
        </SQLiteProvider>
      </TamaguiProvider>
    </Suspense>
  );
}
