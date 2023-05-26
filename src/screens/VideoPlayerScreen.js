import React from "react"
import { useSelector } from "react-redux"
import { View, StyleSheet, SafeAreaView } from "react-native"
import { Video } from "expo-av"

const VideoPlayerScreen = () => {
  const { currentVideoIndex, currentVideoTime, isPlaying, videos } =
    useSelector((state) => state.video)

  const video = videos[currentVideoIndex]

  return (
    <SafeAreaView style={styles.container}>
      {video && (
        <Video
          source={{ uri: video.sources }}
          style={styles.videoPlayer}
          shouldPlay={isPlaying}
          isMuted={false}
          resizeMode="contain"
          useNativeControls
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
})

export default VideoPlayerScreen
