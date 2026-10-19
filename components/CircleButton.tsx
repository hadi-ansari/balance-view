import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.circleButtonContainer,
        { borderColor: theme.colors.primary },
      ]}
    >
      <Pressable
        style={[styles.circleButton, { backgroundColor: theme.colors.surface }]}
        onPress={onPress}
      >
        <MaterialIcons
          name="add"
          size={38}
          color={theme.colors.onSurface}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
  },
});
