import React from "react"
import { createStackNavigator } from "react-navigation-stack"
import { createAppContainer } from "react-navigation"
import VideoListScreen from "../screens/VideoListScreen"
import VideoPlayerScreen from "../screens/VideoPlayerScreen"

const StackNavigator = createStackNavigator(
  {
    VideoList: {
      screen: VideoListScreen,
      navigationOptions: {
        title: "Video List",
      },
    },
    VideoPlayer: {
      screen: VideoPlayerScreen,
      navigationOptions: {
        title: "Video Player",
      },
    },
  },
  {
    initialRouteName: "VideoList",
  }
)

export default createAppContainer(StackNavigator)
