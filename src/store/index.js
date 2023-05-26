import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query/react"
import { videoApi } from "../api/videoApi"
import videoReducer from "./features/videoSlice"

const store = configureStore({
  reducer: {
    [videoApi.reducerPath]: videoApi.reducer,
    video: videoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videoApi.middleware),
})

setupListeners(store.dispatch)

export default store
