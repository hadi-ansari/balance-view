// lib/db.ts
import { useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  description: string | null;
  created_at: number;
};

export type Income = {
  id: number;
  name: string;
  amount: number;
  description: string | null;
  created_at: number;
};

export function useExpenses() {
  const db = useSQLiteContext();

  const getAll = useCallback(async () => {
    return await db.getAllAsync<Expense>(
      "SELECT * FROM expenses ORDER BY created_at DESC",
    );
  }, [db]);

  const insert = useCallback(async (name: string, amount: number, description?: string) => {
    await db.runAsync(
      "INSERT INTO expenses (name, amount, description) VALUES (?, ?, ?)",
      name,
      amount,
      description ?? null,
    );
  }, [db]);

  const remove = useCallback(async (id: number) => {
    await db.runAsync("DELETE FROM expenses WHERE id = ?", id);
  }, [db]);

  return { getAll, insert, remove };
}

export function useIncome() {
  const db = useSQLiteContext();

  const getAll = useCallback(async () => {
    return await db.getAllAsync<Income>(
      "SELECT * FROM income ORDER BY created_at DESC",
    );
  }, [db]);

  const insert = useCallback(async (name: string, amount: number, description?: string) => {
    await db.runAsync(
      "INSERT INTO income (name, amount, description) VALUES (?, ?, ?)",
      name,
      amount,
      description ?? null,
    );
  }, [db]);

  const remove = useCallback(async (id: number) => {
    await db.runAsync("DELETE FROM income WHERE id = ?", id);
  }, [db]);

  return { getAll, insert, remove };
}
