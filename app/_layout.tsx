import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { migrateDb } from "./database/migrate-db";

export default function RootLayout() {
  return (
    <Suspense fallback={<></>}>
      <SQLiteProvider
        databaseName="my-database.db"
        onInit={migrateDb}
        useSuspense
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
