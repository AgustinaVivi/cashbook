import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Income() {
  return (
    <Image source={require("../assets/income.png")} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    margin: 10,
  },
});
