import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { paginationPlugin } from "@reduxjs/toolkit/query"

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://admirsaheta.com/" }),
  tagTypes: ["MyMovies"],
  endpoints: (builder) => ({
    getVideos: builder.query({
      // query: () => "movies",
      query: (page = 1) => `movies?page=${page}`,
      providesTags: (result, error, page) => [{ type: "MyMovies", id: page }],
    }),
  }),
  plugins: [paginationPlugin],
})

export const { useGetVideosQuery } = videoApi
