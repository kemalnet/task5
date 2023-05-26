import React, { useEffect, useState, useMemo, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native"
import { useGetVideosQuery } from "../api/videoApi"
import {
  setCurrentVideoIndex,
  setIsPlaying,
  setVideos,
  setCurrentTime,
} from "../store/features/videoSlice"
import { Video } from "expo-av"
import { Card } from "react-native-paper"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Header from "../components/Header"

const VideoListScreen = ({ navigation }) => {
  const { data: videosData, isLoading, isError } = useGetVideosQuery()
  const { videos, currentVideoIndex, currentVideoTime, isPlaying } =
    useSelector((state) => state.video)
  const dispatch = useDispatch()
  const videoRef = useRef(null)
  const imageRef = useRef(null)

  const [page, setPage] = useState(1)
  const [centerItemIndex, setCenterItemIndex] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [searchResults, setSearchResults] = useState([])

  const toggleMode = () => {
    setIsOnline((prevState) => !prevState)
  }

  useEffect(() => {
    const storeVideos = async () => {
      try {
        await AsyncStorage.setItem("videos", JSON.stringify(videosData.videos))
        dispatch(setCurrentVideoIndex(0))
        dispatch(setIsPlaying(true))
        dispatch(setVideos({ videos: videosData.videos }))
      } catch (error) {
        console.log("Error storing videos:", error)
      }
    }

    if (videosData) {
      storeVideos()
    }
  }, [dispatch, videosData])

  useEffect(() => {
    const retrieveVideos = async () => {
      try {
        const storedVideos = await AsyncStorage.getItem("videos")
        if (storedVideos !== null) {
          dispatch(setVideos({ videos: JSON.parse(storedVideos) }))
        }
      } catch (error) {
        console.log("Error retrieving videos:", error)
      }
    }
    if (!isOnline) {
      retrieveVideos()
    }
  }, [dispatch, isOnline])

  const handleVideoPress = (index) => {
    dispatch(setCurrentVideoIndex(index))
    dispatch(setIsPlaying(true))
    dispatch(setCurrentTime(0))
    navigation.navigate("VideoPlayer")
  }

  /* FOR PAGINATION */
  const videosPerPage = 5

  const videosChunks = useMemo(() => {
    return videos.reduce((acc, _, i) => {
      if (i % videosPerPage === 0) {
        acc.push(videos.slice(i, i + videosPerPage))
      }
      return acc
    }, [])
  }, [videos])

  const fetchNextPage = () => {
    setPage((prevPage) => prevPage + 1)
    console.log("FETCH NEW PAGE")
  }

  const onEndReached = () => {
    if (videos.length >= page * videosPerPage) {
      fetchNextPage()
    }
  }

  /* SEARCH */
  const [keyword, setKeyword] = useState("")

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword)
  }

  useEffect(() => {
    if (!keyword.length) {
      setSearchResults([])
      // don't do anything
      return
    }
    const filteredVideos = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(keyword.toLowerCase()) ||
        video.description.toLowerCase().includes(keyword.toLowerCase())
    )
    setSearchResults(filteredVideos)
  }, [keyword])

  /* FLATLIST RENDER */
  const [isVideoReady, setIsVideoReady] = useState(false)

  const handleViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const centerIndex = Math.floor(viewableItems.length / 2)
      setCenterItemIndex(viewableItems[centerIndex].index)
    }
  }, [])

  const renderFooter = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="gray"
          style={styles.footerIndicator}
        />
      )
    } else {
      return null
    }
  }

  /* VIDEO ITEM OF FLATLIST*/
  const renderVideoItem = ({ item, index }) => {
    const { title, description, sources, thumb } = item

    const handleVideoPlaybackStatusUpdate = (status) => {
      if (status && status.isLoaded) {
        setIsVideoReady(true)
      } else {
        setIsVideoReady(false)
      }
    }

    return (
      <Card style={styles.videoCard}>
        <TouchableOpacity
          onPress={() => handleVideoPress(index)}
          activeOpacity={0.8}
        >
          <View>
            {centerItemIndex === index ? (
              <View style={styles.videoItem}>
                <Video
                  ref={videoRef}
                  source={{ uri: sources }}
                  style={styles.videoPlayer}
                  shouldPlay={true}
                  isMuted={false}
                  resizeMode="contain"
                  useNativeControls
                  onLoad={(status) => handleVideoPlaybackStatusUpdate(status)}
                  onLoadStart={(status) =>
                    handleVideoPlaybackStatusUpdate(status)
                  }
                  onReadyForDisplay={(status) =>
                    handleVideoPlaybackStatusUpdate(status)
                  }
                  volume={0.5}
                />
              </View>
            ) : (
              <View style={styles.videoItem}>
                <ActivityIndicator
                  size="small"
                  color="gray"
                  style={{
                    position: "absolute",
                    top: 92,
                    left: 164,
                    zIndex: 12,
                  }}
                />

                <Image
                  ref={imageRef}
                  source={require("../../assets/icon.png")}
                  style={styles.videoThumbnail}
                />
              </View>
            )}

            <>
              <Text
                style={
                  centerItemIndex === index
                    ? styles.videoTitleActive
                    : styles.videoTitle
                }
              >
                {title}
              </Text>
              <Text style={styles.videoDescription}>
                {description.substring(0, 70)}...
                {centerItemIndex === index ? "[Video is centered]" : ""}
              </Text>
            </>
          </View>
        </TouchableOpacity>
      </Card>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <Header
          isOnline={isOnline}
          toggleMode={toggleMode}
          onSearch={handleSearch}
          style={styles.headerComponent}
        />

        {isLoading && page === 1 ? (
          <ActivityIndicator size="large" color="gray" />
        ) : isError ? (
          <Text>Failed to fetch videos.</Text>
        ) : (
          <FlatList
            data={
              searchResults.length > 0
                ? searchResults
                : videosChunks[page - 1] || videos
            }
            renderItem={renderVideoItem}
            keyExtractor={(item, index) => `${index}`}
            contentContainerStyle={styles.flatlistContainer}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 100,
              minimumViewTime: 300,
              // viewAreaCoveragePercentThreshold: 75,
            }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={renderFooter} // Adding load more ActivityIndicator
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },

  listContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
    width: "100%",
  },
  videoCard: {
    padding: 8,
    alignSelf: "center",
    width: "100%",
  },
  flatlistContainer: {},
  videoItem: {
    marginBottom: 4,
    alignItems: "left",
    justifyContent: "left",
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    height: 200,
    zIndex: 11,
  },
  videoThumbnail: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    zIndex: 11,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  videoTitleActive: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginTop: 2,
  },
  videoDescription: {
    fontSize: 14,
    textAlign: "left",
  },
  footerIndicator: {
    marginVertical: 16,
  },
  headerComponent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  separator: {
    width: "100%",
    height: 16,
  },
})

export default VideoListScreen
