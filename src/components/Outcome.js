import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Outcome() {
  return (
    <Image source={require("../assets/outcome.png")} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    margin: 10,
  },
});
