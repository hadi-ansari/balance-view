// lib/db.ts
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

  async function getAll() {
    return await db.getAllAsync<Expense>(
      "SELECT * FROM expenses ORDER BY created_at DESC",
    );
  }

  async function insert(name: string, amount: number, description?: string) {
    await db.runAsync(
      "INSERT INTO expenses (name, amount, description) VALUES (?, ?, ?)",
      name,
      amount,
      description ?? null,
    );
  }

  async function remove(id: number) {
    await db.runAsync("DELETE FROM expenses WHERE id = ?", id);
  }

  return { getAll, insert, remove };
}

export function useIncome() {
  const db = useSQLiteContext();

  async function getAll() {
    return await db.getAllAsync<Income>(
      "SELECT * FROM income ORDER BY created_at DESC",
    );
  }

  async function insert(name: string, amount: number, description?: string) {
    await db.runAsync(
      "INSERT INTO income (name, amount, description) VALUES (?, ?, ?)",
      name,
      amount,
      description ?? null,
    );
  }

  async function remove(id: number) {
    await db.runAsync("DELETE FROM income WHERE id = ?", id);
  }

  return { getAll, insert, remove };
}
