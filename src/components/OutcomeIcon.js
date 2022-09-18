import React from "react";
import { Image, StyleSheet } from "react-native";

export default function OutcomeIcon() {
  return (
    <Image source={require("../assets/arrow-right.png")} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
    marginLeft: 'auto',
  },
});
