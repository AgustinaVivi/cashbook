import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <Image source={require("../assets/profile-min.jpeg")} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 150,
    marginRight: 20,
    borderRadius: 8,
  },
});
