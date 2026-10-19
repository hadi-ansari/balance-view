import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

export const palette = {
  teal: "#0F766E",
  tealLight: "#78D5C9",
  tealContainer: "#A8F2E7",
  gold: "#D6A21D",
  green: "#2E7D32",
  greenLight: "#81C784",
  red: "#BA1A1A",
  redLight: "#FFB4AB",
  background: "#F6F8F7",
  surface: "#FFFFFF",
  text: "#18201D",
  muted: "#64736E",
  outline: "#CBD5D1",
  darkBackground: "#101412",
  darkSurface: "#191C1B",
  darkText: "#E1E3E0",
  darkMuted: "#B0CCC5",
  darkOutline: "#3E4945",
} as const;

export const lightAppTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.teal,
    onPrimary: palette.surface,
    primaryContainer: palette.tealContainer,
    onPrimaryContainer: "#00201D",
    secondary: palette.gold,
    onSecondary: "#3F2E00",
    background: palette.background,
    onBackground: palette.text,
    surface: palette.surface,
    onSurface: palette.text,
    surfaceVariant: "#E0EAE6",
    onSurfaceVariant: palette.muted,
    outline: "#75817D",
    outlineVariant: palette.outline,
    error: palette.red,
    onError: palette.surface,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: "#EFF5F2",
      level2: "#E8F1ED",
      level3: "#E1ECE7",
    },
  },
};

export const darkAppTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.tealLight,
    onPrimary: "#003732",
    primaryContainer: "#005048",
    onPrimaryContainer: palette.tealContainer,
    secondary: "#F3C64F",
    onSecondary: "#3F2E00",
    background: palette.darkBackground,
    onBackground: palette.darkText,
    surface: palette.darkSurface,
    onSurface: palette.darkText,
    surfaceVariant: "#3E4945",
    onSurfaceVariant: palette.darkMuted,
    outline: "#89938F",
    outlineVariant: palette.darkOutline,
    error: palette.redLight,
    onError: "#690005",
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level1: "#17201E",
      level2: "#192824",
      level3: "#1B302B",
    },
  },
};

function createNavigationTheme(
  baseTheme: NavigationTheme,
  paperTheme: MD3Theme,
): NavigationTheme {
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outlineVariant,
      notification: paperTheme.colors.error,
    },
  };
}

export const lightNavigationTheme = createNavigationTheme(
  NavigationDefaultTheme,
  lightAppTheme,
);

export const darkNavigationTheme = createNavigationTheme(
  NavigationDarkTheme,
  darkAppTheme,
);

export function getSemanticColors(isDark: boolean) {
  return {
    remaining: isDark ? palette.greenLight : palette.green,
    expense: isDark ? palette.redLight : palette.red,
    accent: isDark ? "#F3C64F" : palette.gold,
  };
}
