import React from "react"
import { Provider } from "react-redux"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import StackNavigator from "./src/navigation/Stack"
import store from "./src/store"

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StackNavigator />
        <StatusBar style="auto" />
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
