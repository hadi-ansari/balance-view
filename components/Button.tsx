import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  const appTheme = useTheme();

  if (theme === "primary") {
    return (
      <View
        style={[
          styles.buttonContainer,
          {
            borderWidth: 4,
            borderColor: appTheme.colors.primary,
            borderRadius: 18,
          },
        ]}
      >
        <Pressable
          style={[
            styles.button,
            { backgroundColor: appTheme.colors.surface },
          ]}
          onPress={onPress}
        >
          <FontAwesome
            name="picture-o"
            size={18}
            color={appTheme.colors.onSurface}
            style={styles.buttonIcon}
          />
          <Text
            style={[styles.buttonLabel, { color: appTheme.colors.onSurface }]}
          >
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text
          style={[styles.buttonLabel, { color: appTheme.colors.onSurface }]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
