import React, { useState } from "react"
import { View, Text, TextInput, Button, Switch, StyleSheet } from "react-native"

const Header = ({ isOnline, toggleMode, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query)
  }

  const handleSubmit = () => {
    onSearch(searchQuery)
    setSearchQuery("")
  }

  return (
    <View style={styles.headerContainer}>
      {/* Other header components */}
      <View style={styles.headerPart}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos"
          value={searchQuery}
          onChangeText={handleSearchQueryChange}
        />
        <Button onPress={handleSubmit} title="Go" style={styles.searchButton} />
      </View>
      <View style={styles.headerPart2}>
        <Text style={styles.headerText}>{isOnline ? "Online" : "Offline"}</Text>
        <Switch
          value={isOnline}
          onValueChange={toggleMode}
          style={styles.headerSwitch}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 0,
  },
  headerPart: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerPart2: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "gray",
  },
  searchButton: {
    marginRight: 2,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  headerSwitch: {},
  headerText: {
    marginRight: 4,
    fontSize: 14,
    fontWeight: "regular",
  },
})

export default Header
