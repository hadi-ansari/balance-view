import {
  CURRENCIES,
  CurrencyCode,
  DEFAULT_CURRENCY,
  isCurrencyCode,
} from "@/constants/currencies";
import { useSQLiteContext } from "expo-sqlite";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FormatCurrencyOptions = {
  showSign?: boolean;
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  currencySymbol: string;
  formatCurrency: (
    value: number,
    options?: FormatCurrencyOptions,
  ) => string;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [currency, setCurrencyState] =
    useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    let isActive = true;

    db.getFirstAsync<{ value: string }>(
      "SELECT value FROM settings WHERE key = 'currency'",
    )
      .then((row) => {
        if (isActive && row && isCurrencyCode(row.value)) {
          setCurrencyState(row.value);
        }
      })
      .catch((error) => {
        console.error("Error loading currency setting:", error);
      });

    return () => {
      isActive = false;
    };
  }, [db]);

  const setCurrency = useCallback(
    async (nextCurrency: CurrencyCode) => {
      await db.runAsync(
        `INSERT INTO settings (key, value) VALUES ('currency', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        nextCurrency,
      );
      setCurrencyState(nextCurrency);
    },
    [db],
  );

  const formatCurrency = useCallback(
    (value: number, options?: FormatCurrencyOptions) => {
      const safeValue = Number.isFinite(value) ? value : 0;
      const showSign = options?.showSign ?? false;
      const valueToFormat = showSign ? Math.abs(safeValue) : safeValue;
      const localizedValue = new Intl.NumberFormat(undefined, {
        currency,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        style: "currency",
      }).format(valueToFormat);
      const formattedValue =
        currency === "SEK" ? localizedValue.replace(/SEK/g, "kr") : localizedValue;

      if (!showSign || safeValue === 0) return formattedValue;
      return `${safeValue > 0 ? "+" : "−"}${formattedValue}`;
    },
    [currency],
  );

  const currencySymbol =
    CURRENCIES.find((option) => option.code === currency)?.symbol ?? currency;

  const value = useMemo(
    () => ({ currency, currencySymbol, formatCurrency, setCurrency }),
    [currency, currencySymbol, formatCurrency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
