import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { videoApi } from "../../api/videoApi"

export const fetchVideos = createAsyncThunk("video/fetchVideos", async () => {
  const response = await videoApi.getVideos()
  return response.data.videos
})

const videoSlice = createSlice({
  name: "video",
  initialState: {
    currentVideoIndex: 0,
    currentVideoTime: 0,
    isPlaying: true,
    videos: [],
  },
  reducers: {
    setCurrentVideoIndex: (state, action) => {
      state.currentVideoIndex = action.payload
    },
    setCurrentTime: (state, action) => {
      state.currentVideoTime = action.payload
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload
    },
    setVideos: (state, action) => {
      state.videos = action.payload.videos
    },
  },
})

export const { setCurrentVideoIndex, setCurrentTime, setIsPlaying, setVideos } =
  videoSlice.actions

export const useVideoSlice = () => {
  return { video: useSelector((state) => state.video), dispatch }
}

export default videoSlice.reducer
